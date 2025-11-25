from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, current_user
from models import User, db
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'user') # Accepts 'user' or 'agent'

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already registered"}), 409

    new_user = User(username=username, email=email, role=role)
    new_user.set_password(password)
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"msg": "User registered successfully", "user_id": new_user.id}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    # CRITICAL SECURITY CHECK
    if user and user.check_password(password): 
        
        # Pass the full User object. app.py handles the string conversion.
        access_token = create_access_token(identity=user) 
        
        # Return the user's role
        return jsonify({
            "access_token": access_token,
            "user": {"id": user.id, "username": user.username, "role": user.role}
        })
        
    return jsonify({"msg": "Bad username or password"}), 401 # 401 Unauthorized

@auth_bp.route('/verify-token', methods=['GET'])
@jwt_required()
def verify_token():
    return jsonify({
        "msg": "Token is valid",
        "user": {"id": current_user.id, "username": current_user.username, "role": current_user.role}
    })