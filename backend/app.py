from dotenv import load_dotenv 
load_dotenv() 

from flask import Flask, jsonify, request
from flask_cors import CORS # Import CORS
from extensions import db, jwt, mail
from routes.auth_routes import auth_bp
from routes.prediction_routes import prediction_bp
from routes.property_routes import property_bp
from routes.chatbot_routes import chatbot_bp
from routes.query_routes import query_bp
# Import all models so db.create_all() builds them
from models import User, Property, Inquiry, PredictionLog, Favorite, GeneralQuery
from ml_utils import load_model 
import os

class Config:
    # Secret key for session management and security
    SECRET_KEY = os.environ.get('SECRET_KEY', 'my_strong_dev_secret')
    
    # Database configuration
    SQLALCHEMY_DATABASE_URI = 'sqlite:///realestate.db' 
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'super-secret-jwt')
    JWT_TOKEN_LOCATION = ["headers"]
    
    # Email configuration
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'True').lower() in ('true', '1', 't')
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_USERNAME')


def create_app():
    # --- App Initialization ---
    app = Flask(__name__)
    app.config.from_object(Config)

    # --- Initialize CORS ---
    # This handles all OPTIONS preflight requests correctly.
    CORS(app, 
         resources={r"/api/*": {"origins": "http://localhost:3000"}}, 
         supports_credentials=True
    )

    # --- Initialize Extensions ---
    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)

    # --- Register Blueprints ---
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(prediction_bp, url_prefix='/api')
    app.register_blueprint(property_bp, url_prefix='/api')
    app.register_blueprint(chatbot_bp, url_prefix='/api')
    app.register_blueprint(query_bp, url_prefix='/api')

    # --- JWT User Loaders ---
    @jwt.user_identity_loader
    def user_identity_lookup(user):
        return str(user.id) 

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        identity = jwt_data["sub"]
        return db.session.get(User, identity) 

    # --- App Context Setup ---
    with app.app_context():
        # Create database tables for all models
        db.create_all() 
        # Load the machine learning model
        load_model() 

    # Note: The old '@app.after_request' for CORS is removed, 
    # as the 'CORS(app)' call now handles it properly.

    return app

# --- Run Application ---
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)