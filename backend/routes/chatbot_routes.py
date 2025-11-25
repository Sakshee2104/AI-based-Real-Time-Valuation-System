# c:\real_estate_project\backend\routes\chatbot_routes.py

from flask import Blueprint, jsonify, request
# FIX: Only import 'jwt_required'. The 'optional_jwt_required' name is obsolete.
from flask_jwt_extended import jwt_required 
from ml_utils import get_chatbot_response # This function calls the Gemini client

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('/chatbot', methods=['POST'])
@jwt_required(optional=True) # FIX: Use jwt_required with the optional=True parameter
def chatbot_interaction():
    data = request.get_json()
    user_prompt = data.get('prompt')
    chat_history = data.get('history', []) 

    if not user_prompt:
        return jsonify({"msg": "No prompt provided"}), 400

    try:
        response_text = get_chatbot_response(user_prompt, chat_history)
        
        return jsonify({
            "response": response_text
        })
    except Exception as e:
        import traceback
        traceback.print_exc() # Print full error stack to the server console
        
        return jsonify({
            "msg": "Internal Chatbot Error",
            "error_detail": str(e) 
        }), 500