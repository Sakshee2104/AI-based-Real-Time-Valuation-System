# c:\real_estate_project\backend\test_chatbot.py

import requests
import json
import os
import textwrap # Used for clean output formatting

# --- CONFIGURATION ---
CHATBOT_URL = "http://127.0.0.1:5000/api/chatbot"

# --- Define Test Prompts ---
prompts = [
    "Tell me about the data your prediction model uses.", # Tests DATA_SUMMARY knowledge
    "What is the average price for a 3 BHK in Koramangala?",
    "What is the best type of property to invest in now?",
]

def run_chatbot_test_isolated():
    print("\n--- Starting Isolated Chatbot Test ---")
    
    # We send minimal headers, relying on the route's jwt_required(optional=True) setting.
    headers = {"Content-Type": "application/json"}

    for prompt in prompts:
        # Payload only needs prompt and history (which is empty)
        payload = {"prompt": prompt, "history": []}
        print(f"\nQUERY: {prompt}")

        try:
            chat_response = requests.post(CHATBOT_URL, headers=headers, json=payload)
            chat_response.raise_for_status() 
            
            result = chat_response.json()
            response_text = result.get('response', 'No response field found.')
            
            # --- Display Results ---
            print("RESPONSE:")
            print("-" * 60)
            # Use textwrap for readable console output
            print(textwrap.fill(response_text, width=60)) 
            print("-" * 60)
            
        except requests.exceptions.HTTPError as e:
            print(f"❌ API CALL FAILED (Status: {e.response.status_code})")
            print(f"Error Details: {e.response.text}")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")


if __name__ == "__main__":
    # Ensure Flask server is running in its own terminal before executing this script!
    run_chatbot_test_isolated()