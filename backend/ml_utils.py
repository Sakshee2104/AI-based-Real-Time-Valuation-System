import joblib
import os
import numpy as np 
import google.genai as genai 
# Note: Models and JWT components are imported inside functions below

# --- CONFIGURATION & MODEL VARIABLES ---

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.joblib')
FEATURES_PATH = os.path.join(os.path.dirname(__file__), 'model_features.joblib')
FEATURE_COLS = [] 
ML_MODEL = None

# --- GEMINI INITIALIZATION ---
client = None
try:
    GEMINI_KEY = os.environ.get("GEMINI_API_KEY")
    if not GEMINI_KEY:
        raise ValueError("GEMINI_API_KEY environment variable is missing or empty.")
        
    client = genai.Client(api_key=GEMINI_KEY)
    print("Gemini Client initialized.")
    
except Exception as e:
    print(f"WARNING: Gemini Client failed to initialize. Error: {e}")
    
# --- 1. MODEL LOADING ---

def load_model():
    """Loads the trained ML model and its feature list."""
    global FEATURE_COLS, ML_MODEL
    try:
        if os.path.exists(MODEL_PATH) and os.path.exists(FEATURES_PATH):
            ML_MODEL = joblib.load(MODEL_PATH)
            FEATURE_COLS = joblib.load(FEATURES_PATH)
            print(f"ML Model loaded with {len(FEATURE_COLS)} features.")
            return ML_MODEL
        else:
            return None
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

# --- 2. PREPROCESSING & PREDICTION (functions remain unchanged) ---

def preprocess_input(data):
    """Transforms raw input data into a feature vector for the ML model."""
    global FEATURE_COLS
    if not FEATURE_COLS:
        return [0] * 5 
        
    input_features = {col: 0 for col in FEATURE_COLS}
    
    input_features['area'] = float(data.get('area', 0))
    input_features['bhk'] = int(data.get('bhk', 0))
    
    location = data.get('location', 'other').lower().replace(' ', '_')
    location_key = f"location_mapped_{location}"
    
    if location_key in FEATURE_COLS:
        input_features[location_key] = 1
        
    return [input_features[col] for col in FEATURE_COLS]

def predict_and_revert(input_vector):
    """Predicts price (log-transformed) and reverts it to the original scale."""
    if ML_MODEL is None:
        area = input_vector[0] if len(input_vector) > 0 else 1000
        bhk = input_vector[1] if len(input_vector) > 1 else 2
        return round(50.00 + (bhk * 5) + (area * 0.01), 2)

    predicted_price_log = ML_MODEL.predict([input_vector])[0]
    predicted_price = np.exp(predicted_price_log)
    
    return round(predicted_price, 2)

# --- 3. CMA HELPER ---

def get_cma_properties(location, bhk, limit=20):
    """Fetches similar properties for Comparative Market Analysis."""
    try:
        # Local import to rely on Flask application context
        from models import Property 
    except ImportError:
        return []

    location_pattern = f'%{location.split(" ")[0]}%' 
    
    try:
        properties = Property.query.filter(
            Property.location.ilike(location_pattern),
            Property.bhk.between(bhk - 1, bhk + 1)
        ).limit(limit).all()
        return properties
    except Exception as e:
        print(f"CMA Database Query Failed: {e}")
        return []

# --- 4. CHATBOT HELPER (USER CONTEXT & DATABASE QUERY) ---

DATA_SUMMARY = (
    "The house price prediction model was trained on cleaned real estate data for Bengaluru (Bangalore). "
    "The key features used for prediction are: **Location** (top 20 localities like Whitefield, Koramangala, etc.), "
    "**BHK (Number of Bedrooms)**, and **Area (Total Square Footage)**. All price estimations are given in Lakhs."
)

def get_chatbot_response(prompt, history=None):
    """Generates a response using the Gemini API, checking user context first."""
    
    # --- STEP 1: Check Database/User Context ---
    # LOCAL IMPORT: Necessary for accessing the user session and DB models
    try:
        from flask_jwt_extended import current_user, get_jwt_identity
        from models import Property
    except Exception:
        # Fallback if dependencies aren't available (e.g., if running outside the venv)
        pass 
        
    user_identity = get_jwt_identity()
    
    if user_identity and ("who is logged in" in prompt.lower() or "my profile" in prompt.lower()):
        # This branch handles the specific query "who is logged in?"
        
        if current_user and current_user.username:
            # Query the database for the user's properties count (robust against errors)
            property_count = 0
            try:
                property_count = Property.query.filter_by(agent_id=current_user.id).count()
            except Exception:
                pass # Fail silently if query fails (e.g., during testing)
            
            return (f"The user currently logged in is **{current_user.username}** "
                    f"with the role of **{current_user.role}**. If they are an Agent, they currently have **{property_count}** properties listed.")
        else:
            return "A session token is present, but I couldn't fully load the user's database profile."


    # --- STEP 2: General Gemini API Call ---
    if client:
        try:
            from google.genai import types # Local import for GenerationConfig
            
            contents = []
            
            system_instruction_text = (
                f"You are a helpful and friendly real estate assistant specializing in the Bengaluru market. "
                f"Your primary knowledge base is the price prediction dataset summary: {DATA_SUMMARY}. "
                "Answer questions about what data the model uses and general real estate queries."
            )
            
            # Build contents list
            if history:
                 for msg in history:
                    contents.append({
                        "role": "user" if msg.get('sender') == 'user' else "model",
                        "parts": [{"text": msg.get('text')}]
                    })
            contents.append({"role": "user", "parts": [{"text": prompt}]})
            
            # Package the instruction into a GenerationConfig object
            config_obj = types.GenerateContentConfig(
                system_instruction=system_instruction_text
            )

            # API Call
            response = client.models.generate_content(
                model="gemini-2.5-flash", 
                contents=contents,
                config=config_obj 
            )
            return response.text

        except Exception as e:
            print(f"Gemini API runtime error: {e}")
            return "Sorry, the AI service encountered an error processing your request."
            
    return "I'm a real estate AI assistant. The Gemini service is not available right now. Please check your API key setup."