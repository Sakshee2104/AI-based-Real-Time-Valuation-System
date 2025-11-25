import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
import joblib
import os
import xgboost as xgb  # <--- NEW IMPORT: XGBoost library

DATA_PATH = os.path.join(os.path.dirname(__file__), 'ml_data', 'cleaned_Bengaluru_House_Data (3).csv')
MODEL_SAVE_PATH = os.path.join(os.path.dirname(__file__), 'model.joblib')
FEATURES_SAVE_PATH = os.path.join(os.path.dirname(__file__), 'model_features.joblib')

def remove_pps_outliers(df):
    """Removes outliers based on price_per_sqft within 1 standard deviation per location."""
    df_out = pd.DataFrame()
    for key, subdf in df.groupby('location_mapped'):
        m = np.mean(subdf.price_per_sqft)
        st = np.std(subdf.price_per_sqft)
        filtered_df = subdf[(subdf.price_per_sqft > (m - st)) & (subdf.price_per_sqft <= (m + st))]
        df_out = pd.concat([df_out, filtered_df], ignore_index=True)
    return df_out

def train_and_save_model():
    print(f"--- Starting High-Accuracy XGBoost Model Training ---")
    
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    DATA_PATH_ABS = os.path.join(BASE_DIR, 'ml_data', 'cleaned_Bengaluru_House_Data (3).csv')

    try:
        df = pd.read_csv(DATA_PATH_ABS)
    except FileNotFoundError:
        print("ERROR: CSV file not found. Cannot train model.")
        return

    # --- 1. FEATURE ENGINEERING & CLEANING (UNCHANGED) ---
    df['bhk'] = df['size'].apply(lambda x: int(x.split(' ')[0]) if isinstance(x, str) else x)
    df.rename(columns={'total_sqft': 'area', 'price': 'target_price'}, inplace=True)
    df.dropna(subset=['location', 'bhk', 'area', 'target_price'], inplace=True)

    df['price_per_sqft'] = df['target_price'] / df['area']
    df = df[~(df['area'] / df['bhk'] < 300)]
    
    top_locations = df['location'].value_counts().head(20).index
    df['location_mapped'] = df['location'].apply(lambda x: x if x in top_locations else 'other')
    df = remove_pps_outliers(df.copy())
    
    # --- 2. TRANSFORMATION ---
    df['target_price_log'] = np.log(df['target_price'])
    
    # --- 3. ONE-HOT ENCODING ---
    df = pd.get_dummies(df, columns=['location_mapped'], prefix='location_mapped', drop_first=True)

    # --- 4. MODEL TRAINING ---
    
    feature_cols = [col for col in df.columns if col.startswith('location_mapped_') or col in ['bhk', 'area']]
    X = df[feature_cols]
    y = df['target_price_log'] # TRAIN on the LOG-TRANSFORMED target
    
    if X.empty:
        print("ERROR: No features remaining after preprocessing.")
        return

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # --- XGBoost Regressor (HIGH ACCURACY) ---
    model = xgb.XGBRegressor(
        n_estimators=1000, 
        learning_rate=0.05, 
        max_depth=6, 
        random_state=42, 
        n_jobs=-1
    )
    model.fit(X_train, y_train)

    score = model.score(X_test, y_test)
    print(f"Model trained successfully. XGBoost R-squared score: {score:.4f}")
    
    # Save Artifacts
    joblib.dump(model, MODEL_SAVE_PATH)
    joblib.dump(X.columns.tolist(), FEATURES_SAVE_PATH)
    
    print(f"Model saved to {MODEL_SAVE_PATH}")
    print(f"Features saved to {FEATURES_SAVE_PATH}")

if __name__ == '__main__':
    train_and_save_model()