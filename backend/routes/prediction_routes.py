from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ml_utils import ML_MODEL, preprocess_input, get_cma_properties, predict_and_revert
from models import PredictionLog, db, Property

prediction_bp = Blueprint('prediction', __name__)

@prediction_bp.route('/predict', methods=['POST'])
@jwt_required(optional=True)  # Allows both logged-in and anonymous users
def predict_price():
    data = request.get_json() or {}

    # --- Validation ---
    required_fields = ['location', 'bhk', 'area']
    missing = [f for f in required_fields if f not in data or data[f] in [None, ""]]
    if missing:
        return jsonify({"msg": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        location = str(data.get('location')).strip()
        bhk = int(data.get('bhk'))
        area = float(data.get('area'))
    except Exception as e:
        return jsonify({"msg": f"Invalid data format: {e}"}), 400

    # --- ML Model Execution ---
    predicted_price = 0.0
    if ML_MODEL:
        try:
            # This is where the real prediction happens
            input_vector = preprocess_input(data)
            predicted_price = round(float(predict_and_revert(input_vector)), 2)
        except Exception as e:
            print(f"[Prediction Error] Model execution failed: {e}")
            predicted_price = 75.00  # fallback value
    else:
        # Dummy prediction if model not loaded
        predicted_price = round(50.00 + (bhk * 5) + (area * 0.01), 2)

    user_id = get_jwt_identity()

    # Log the prediction
    try:
        log = PredictionLog(
            user_id=user_id,
            location=location,
            bhk=bhk,
            area=area,
            predicted_price=predicted_price
        )
        db.session.add(log)
        db.session.commit()
    except Exception as e:
        print(f"[DB Error] Failed to log prediction: {e}")
        db.session.rollback()

    return jsonify({
        "predicted_price": predicted_price,
        "log_id": log.id if 'log' in locals() else None
    }), 200


@prediction_bp.route('/cma', methods=['GET'])
@jwt_required()  # This route REQUIRES a valid login
def get_cma():
    location = request.args.get('location')
    bhk = request.args.get('bhk', default=3, type=int)

    if not location:
        return jsonify({"msg": "Missing 'location' parameter"}), 400

    try:
        cma_listings = get_cma_properties(location, bhk, limit=20)
        results = [{
            "id": prop.id,
            "image_url": prop.image_url,
            "price": prop.price,
            "location": prop.location,
            "bhk": prop.bhk,
            "agent_name": prop.agent.username if prop.agent else "N/A",
            "contact_info": prop.contact_info,
            "profile_link": f"/agents/{prop.agent_id}"
        } for prop in cma_listings]

        return jsonify(results), 200
    except Exception as e:
        print(f"[CMA Error] {e}")
        return jsonify({"msg": "Error fetching CMA data"}), 500


@prediction_bp.route('/user/predictions', methods=['GET'])
@jwt_required()
def get_user_predictions():
    user_id = get_jwt_identity()
    try:
        logs = PredictionLog.query.filter_by(user_id=user_id).order_by(PredictionLog.timestamp.desc()).all()
        results = [{
            "id": log.id,
            "location": log.location,
            "bhk": log.bhk,
            "area": log.area,
            "predicted_price": log.predicted_price,
            "timestamp": log.timestamp.isoformat()
        } for log in logs]

        return jsonify(results), 200
    except Exception as e:
        print(f"[Prediction History Error] {e}")
        return jsonify({"msg": "Error fetching user prediction history"}), 500