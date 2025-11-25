from extensions import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), default='user') 
    
    predictions = db.relationship('PredictionLog', backref='user', lazy=True)
    inquiries = db.relationship('Inquiry', backref='user_inquiry', foreign_keys='Inquiry.user_id', primaryjoin="User.id == Inquiry.user_id", lazy=True)
    properties = db.relationship('Property', backref='agent', lazy=True)
    favorites = db.relationship('Favorite', backref='user', lazy=True)
    
    # --- NEW RELATIONSHIP ---
    general_queries = db.relationship('GeneralQuery', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Property(db.Model):
    __tablename__ = 'property'
    id = db.Column(db.Integer, primary_key=True)
    agent_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    bhk = db.Column(db.Integer, nullable=False)
    area = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)
    contact_info = db.Column(db.String(50), default='N/A')
    bath = db.Column(db.Integer, default=2)
    balcony = db.Column(db.Integer, default=1)
    status = db.Column(db.String(20), default='Active')
    amenities = db.Column(db.Text)
    image_url = db.Column(db.String(500), default='https://via.placeholder.com/400x250/F2F2F2/000000?text=PropertyImage')
    listed_on = db.Column(db.DateTime, default=datetime.utcnow)
    
    inquiries_received = db.relationship('Inquiry', backref='property', lazy=True)
    favorited_by = db.relationship('Favorite', backref='property', lazy=True)

class Inquiry(db.Model):
    __tablename__ = 'inquiry'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='Unread')
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class PredictionLog(db.Model):
    __tablename__ = 'prediction_log'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    location = db.Column(db.String(100), nullable=False)
    bhk = db.Column(db.Integer, nullable=False)
    area = db.Column(db.Float, nullable=False)
    predicted_price = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow) 

class Favorite(db.Model):
    __tablename__ = 'favorite'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False)

# --- NEW TABLE FOR GENERAL QUERIES ---
class GeneralQuery(db.Model):
    __tablename__ = 'general_query'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='Unread') # Status: Unread, Replied
    timestamp = db.Column(db.DateTime, default=datetime.utcnow) 
    
    # --- FIELDS ADDED FOR OWNER REPLY ---
    response_text = db.Column(db.Text, nullable=True)
    responded_at = db.Column(db.DateTime, nullable=True)

    # --- ADDED to_dict() METHOD FOR API ---
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "email": self.user.email, # Get email from the user relationship
            "user_name": self.user.username, # Get username from the user relationship
            "subject": self.subject,
            "query_text": self.message, # Use 'query_text' to match front-end
            "response_text": self.response_text,
            "status": self.status.lower(), # Send a consistent lowercase status
            "created_at": self.timestamp.isoformat() if self.timestamp else None,
            "responded_at": self.responded_at.isoformat() if self.responded_at else None
        }