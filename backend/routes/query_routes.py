from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, current_user
from models import GeneralQuery, User # GeneralQuery model now has response_text
from extensions import db, mail # 'db' is imported from extensions
from flask_mail import Message
from datetime import datetime
import os

# Changed blueprint name to 'query_bp' to match your app.py import
query_bp = Blueprint('query_bp', __name__)

@query_bp.route('/query/submit', methods=['POST'])
@jwt_required()
def submit_general_query():
    data = request.get_json()
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    
    if not user:
         return jsonify({"msg": "User not found"}), 404
         
    subject = data.get('subject')
    message_body = data.get('message') # This comes from the UserDashboard modal

    if not subject or not message_body:
        return jsonify({"msg": "Subject and message are required."}), 400

    # 1. Save the query to the database
    new_query = GeneralQuery(
        user_id=user_id,
        subject=subject,
        message=message_body,
        status='pending' # Use 'pending' to match front-end logic
    )
    db.session.add(new_query)
    db.session.commit()

    # 2. Send the email notification to the owner (from .env)
    try:
        owner_email = os.environ.get('MAIL_USERNAME') 
        if not owner_email:
            print("Warning: MAIL_USERNAME not set. Skipping email notification.")
            return jsonify({"msg": "Query submitted successfully."}), 201

        msg = Message(
            subject=f"New User Query: {subject}",
            sender=os.environ.get('MAIL_DEFAULT_SENDER'),
            recipients=[owner_email] # Sending the email TO yourself
        )
        msg.body = (
            f"You have received a new general query from a user.\n\n"
            f"User: {user.username} (Email: {user.email})\n\n"
            f"Subject: {subject}\n\n"
            f"Query:\n{message_body}\n\n"
            f"Please log in to the Owner Dashboard to view and respond."
        )
        mail.send(msg)
        print(f"EMAIL SENT: New query sent to {owner_email}")

    except Exception as e:
        print(f"Warning: Query saved to DB, but email notification failed: {e}")
        # Don't fail the request if only the email fails
        pass

    return jsonify({"msg": "Query submitted successfully. We will get back to you soon."}), 201


@query_bp.route('/query/list', methods=['GET'])
@jwt_required()
def get_all_queries():
    # This route is for the Owner Dashboard
    # Check for 'agent' role (as defined in your User model/logic)
    if current_user.role not in ['agent', 'owner']:
        return jsonify({"msg": "Access Denied"}), 403

    # Use the to_dict() method from models.py to serialize
    # This correctly includes 'response_text', 'user_email', etc.
    queries = GeneralQuery.query.order_by(GeneralQuery.timestamp.desc()).all()
    
    return jsonify([q.to_dict() for q in queries]), 200


# --- FIXED ROUTE ---
# This is the endpoint your OwnerDashboard's "ReplyModal" will call
#
# FIX 1: Changed URL from '/query/reply/<int:query_id>' to '/query/<string:query_id>/reply'
# FIX 2: Changed methods from ['PUT'] to ['POST']
@query_bp.route('/query/<string:query_id>/reply', methods=['POST'])
@jwt_required()
def reply_to_query(query_id):
    # Check for 'agent' or 'owner' role
    if current_user.role not in ['agent', 'owner']:
        return jsonify({"msg": "Access Denied"}), 403
        
    try:
        query = db.session.get(GeneralQuery, query_id)
        if not query:
            return jsonify({"msg": "Query not found"}), 404
            
        data = request.get_json()
        
        # FIX 3: Changed 'response_text' to 'message' to match queryApi.js
        response_text = data.get('message')
        
        if not response_text:
            return jsonify({"msg": "Response text (message) is required."}), 400
            
        # Update the query with the reply
        query.response_text = response_text
        query.status = 'replied' # Or 'in-progress' if you prefer
        query.responded_at = datetime.utcnow()
        
        db.session.commit()
        
        # --- Send email notification TO THE USER ---
        try:
            msg = Message(
                subject=f"Re: Your Query: {query.subject}",
                sender=os.environ.get('MAIL_DEFAULT_SENDER'),
                recipients=[query.user.email] # Send email to the user who asked
            )
            msg.body = (
                f"Hello {query.user.username},\n\n"
                f"You have received a response to your query:\n\n"
                f"Your Question: {query.message}\n\n"
                f"Our Response:\n{response_text}\n\n"
                f"Thank you,\nThe Real Estate Team"
            )
            mail.send(msg)
            print(f"EMAIL SENT: Reply sent to {query.user.email}")
        except Exception as e:
            print(f"Warning: Reply saved to DB, but email notification to user failed: {e}")
            pass # Don't fail the request if email fails

        return jsonify(query.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        # Use str(e) to get a serializable error message
        return jsonify({"error": str(e)}), 500