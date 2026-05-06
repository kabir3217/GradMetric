import pandas as pd
import joblib
import os
import traceback

# The model saved by `create_model1.py` uses the following 8 features (in this order):
TRAIN_FEATURES = [
    'Previous_Semester_GPA',
    'Midterm_Score_Average',
    'Assignment_Score_Average',
    'Twelfth_Grade_Percentage',
    'Study_Hours_Per_Day',
    'Attendance_Percentage',
    'Number_of_Backlogs',
    'Mental_Stress_Score'
]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'cgpa_model2.pkl')


def load_model():
    if not os.path.exists(MODEL_PATH):
        print(f"Model file not found at: {MODEL_PATH}")
        return None
    try:
        model = joblib.load(MODEL_PATH)
        print(f"Loaded model from: {MODEL_PATH}")
        return model
    except Exception:
        print(f"Failed to load model from: {MODEL_PATH}")
        traceback.print_exc()
        return None


model = load_model()


def predict_cgpa(input_data: dict):
    """Predict CGPA from a dict of input values.

    - Uses the feature set the model was trained with (TRAIN_FEATURES).
    - Missing features are filled with 0.0 by default.
    - Any extra keys in input_data are ignored.
    Returns a float prediction or 0.0 if the model is unavailable or an error occurs.
    """
    if model is None:
        print("No model loaded: cannot predict.")
        return 0.0

    try:
        # Build a single-row input keeping the training feature order.
        row = {}
        for feat in TRAIN_FEATURES:
            val = input_data.get(feat, 0)
            # Try converting to numeric; fall back to 0.0 on failure
            try:
                row[feat] = float(val)
            except Exception:
                row[feat] = 0.0

        df = pd.DataFrame([row], columns=TRAIN_FEATURES)

        # Predict and return a scalar float
        prediction = model.predict(df)
        return float(prediction[0])
    except Exception as e:
        print("Prediction error:", e)
        traceback.print_exc()
        return 0.0