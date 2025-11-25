from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, current_user, get_jwt_identity
from models import Property, Inquiry, PredictionLog, User, db
from functools import wraps
from sqlalchemy import func
from ml_utils import get_cma_properties
from extensions import mail 
from flask_mail import Message

# FIX: Initialize the Blueprint variable immediately
property_bp = Blueprint('property', __name__)

def agent_required():
    """Decorator to restrict access to users with role='agent'."""
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            if current_user.role != 'agent':
                return jsonify(msg="Access Denied: Agent role required."), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

## --- 1. LISTING MANAGEMENT (ADD PROPERTY) ---

@property_bp.route('/add-property', methods=['POST'])
@jwt_required()
@agent_required()
def add_property():
    data = request.get_json()
    
    required_fields = ['location', 'bhk', 'area', 'price']
    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Missing required fields"}), 400

    new_property = Property(
        agent_id=current_user.id,
        location=data['location'],
        bhk=data['bhk'],
        area=data['area'],
        price=data['price'],
        bath=data.get('bath', 2), 
        balcony=data.get('balcony', 1),
        amenities=data.get('amenities'),
        image_url=data.get('image_url'),
        status=data.get('status', 'Active'),
        contact_info=data.get('contact_info', 'N/A')
    )
    db.session.add(new_property)
    db.session.commit()
    return jsonify({"msg": "Property listed successfully", "property_id": new_property.id}), 201

## --- 2. SINGLE PROPERTY DETAILS (BUYER FEATURE) ---

@property_bp.route('/property/<int:property_id>', methods=['GET'])
@jwt_required(optional=True) 
def get_property_details(property_id):
    
    # 1. Fetch Property and Agent/Owner info via JOIN
    property_data = db.session.execute(
        db.select(Property, User.username, User.email, Property.contact_info) 
        .join(User, Property.agent_id == User.id)
        .filter(Property.id == property_id)
    ).first()

    if not property_data:
        return jsonify({"msg": "Property not found."}), 404

    # 2. Extract results
    prop, agent_name, agent_email, agent_phone = property_data
    
    return jsonify({
        "id": prop.id,
        "location": prop.location,
        "bhk": prop.bhk,
        "area": prop.area,
        "price": prop.price,
        "bath": prop.bath,
        "balcony": prop.balcony,
        "amenities": prop.amenities,
        "image_url": prop.image_url,
        "status": prop.status,
        
        # 3. OWNER CONTACT DETAILS
        "owner": {
            "name": agent_name,
            "phone": agent_phone or "N/A", 
            "email": agent_email,
        }
    })

## --- 3. GENERAL PROPERTY SEARCH ---

@property_bp.route('/properties', methods=['GET'])
def get_all_properties():
    # Public route for general browsing and filtering
    
    query = db.select(Property)
    
    # Extract filters from query parameters
    location = request.args.get('location')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    bhk = request.args.get('bhk', type=int)

    # Apply filtering dynamically
    if location:
        query = query.filter(Property.location.ilike(f'%{location}%'))
    if min_price is not None:
        query = query.filter(Property.price >= min_price)
    if max_price is not None:
        query = query.filter(Property.price <= max_price)
    if bhk:
        query = query.filter(Property.bhk == bhk)

    # Execute and serialize results
    properties = db.session.scalars(query).all()
    
    results = [{
        "id": p.id, "image_url": p.image_url, "price": p.price, "location": p.location,
        "bhk": p.bhk, "area": p.area, "bath": p.bath, "balcony": p.balcony,
        "status": p.status, "amenities": p.amenities
    } for p in properties]
    
    return jsonify(results)

## --- 4. CMA, INQUIRY MANAGEMENT, ANALYTICS ---

@property_bp.route('/cma', methods=['GET'])
@jwt_required()
def get_cma():
    location = request.args.get('location')
    bhk = int(request.args.get('bhk', 3))
    
    cma_listings = get_cma_properties(location, bhk, limit=20) 
    
    results = [{
        "id": prop.id, "image_url": prop.image_url, "price": prop.price, "location": prop.location,
        "bhk": prop.bhk, "area": prop.area, "bath": prop.bath, "balcony": prop.balcony,  
        "agent_name": prop.agent.username if prop.agent else "N/A", "contact_info": prop.contact_info,
        "profile_link": f"/agents/{prop.agent_id}"
    } for prop in cma_listings]
    
    return jsonify(results)

@property_bp.route('/contact-agent', methods=['POST'])
@jwt_required()
def contact_agent():
    data = request.get_json()
    property_id = data.get('property_id')
    message_body = data.get('message')
    user_id = get_jwt_identity()
    
    if not property_id or not message_body:
        return jsonify({"msg": "Missing property_id or message"}), 400

    property_listing = db.session.get(Property, property_id)
    buyer = db.session.get(User, user_id)
    
    if not property_listing or not buyer:
         return jsonify({"msg": "Invalid property or user ID."}), 404

    new_inquiry = Inquiry(
        user_id=user_id,
        property_id=property_listing.id,
        message=message_body
    )
    db.session.add(new_inquiry)
    db.session.commit()
    
    return jsonify({"msg": "Inquiry sent successfully. Agent notified."}), 200

@property_bp.route('/inquiries/respond/<int:inquiry_id>', methods=['PUT'])
@jwt_required()
@agent_required()
def mark_inquiry_responded(inquiry_id):
    inquiry = db.session.get(Inquiry, inquiry_id)
    
    if not inquiry:
        return jsonify({"msg": "Inquiry not found."}), 404
        
    if inquiry.property.agent_id != current_user.id:
        return jsonify({"msg": "Unauthorized access to this inquiry."}), 403

    # 1. Update status in database
    inquiry.status = 'Replied'
    db.session.commit()
    
    # 2. Notify the Buyer
    buyer = inquiry.user_inquiry
    agent = inquiry.property.agent
    
    if buyer and buyer.email:
        try:
            msg = Message(
                subject=f"✅ Agent Response: Your Inquiry on {inquiry.property.location}",
                recipients=[buyer.email],
                body=(
                    f"Dear {buyer.username},\n\n"
                    f"The agent ({agent.username}) for the property at {inquiry.property.location} "
                    f"has marked your inquiry as responded. They will be contacting you directly.\n\n"
                    f"Thank you,\nRealEstate AI Support"
                )
            )
            mail.send(msg)
            print(f"EMAIL SENT: Buyer ({buyer.email}) notified of agent response.")
            return jsonify({"msg": "Inquiry status updated and buyer notified."}), 200
            
        except Exception as e:
            print(f"Warning: Inquiry update succeeded, but email notification failed: {e}")
            return jsonify({"msg": "Status updated, but email notification failed."}), 200
            
    return jsonify({"msg": "Inquiry status updated successfully."}), 200

## --- 5. ANALYTICS ---

@property_bp.route('/analytics/searches', methods=['GET'])
@jwt_required()
@agent_required()
def get_search_analytics():
    # Logic to fetch recent logs and hot markets
    recent_logs_query = db.select(
        PredictionLog, 
        User.username, 
        User.email
    ).outerjoin(User, PredictionLog.user_id == User.id).order_by(PredictionLog.timestamp.desc()).limit(100)

    recent_logs = db.session.execute(recent_logs_query).all()

    activity_log = []
    for log, username, email in recent_logs:
        activity_log.append({
            "timestamp": log.timestamp.isoformat(),
            "location": log.location,
            "bhk": log.bhk,
            "area": log.area,
            "predicted_price": log.predicted_price,
            "user_name": username if username else "Anonymous",
            "user_email": email if email else "N/A",
            "budget_estimate": f"{log.predicted_price - 5:.2f}L - {log.predicted_price + 5:.2f}L" 
        })

    location_counts_query = db.select(
        PredictionLog.location, 
        func.count(PredictionLog.location).label('count')
    ).group_by(PredictionLog.location).order_by(func.count(PredictionLog.location).desc()).limit(10)

    hot_markets = [{"location": loc, "count": count} for loc, count in db.session.execute(location_counts_query).all()]

    return jsonify({
        "recent_activity": activity_log,
        "hot_markets": hot_markets
    })