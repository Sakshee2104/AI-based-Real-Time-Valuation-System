# c:\real_estate_project\backend\test_prediction.py (Simplified for Prediction Test)

import requests
import json

# The endpoint we want to test
PREDICT_URL = "http://127.0.0.1:5000/api/predict"

# --- 1. Prediction Test Data ---
test_data = {
    "location": "Whitefield", 
    "bhk": 3,
    "area": 1500,
    "amenities": "Pool, Gym"
}

print("--- Sending Prediction Request (Public Test) ---")

try:
    # Send the POST request directly, without login headers
    predict_response = requests.post(PREDICT_URL, json=test_data)
    predict_response.raise_for_status() # Raise exception for 4xx/5xx errors
    
    result = predict_response.json()
    
    # --- 2. Display Results ---
    print("\n✅ ML PREDICTION SUCCESSFUL! (Backend Logic Confirmed)")
    print("-" * 45)
    print(f"Input: {test_data['bhk']} BHK at {test_data['area']} sqft in {test_data['location']}")
    print(f"Predicted Price (Lakhs): {result.get('predicted_price')}")
    print("-" * 45)

except requests.exceptions.HTTPError as e:
    print(f"\n❌ PREDICTION FAILED (Status: {e.response.status_code})")
    print(f"Error Details: {e.response.text}")
    
except Exception as e:
    print(f"An unexpected error occurred: {e}")