import pandas as pd
import joblib
import os

MODEL_PATH = 'cgpa_model1.pkl'

def load_model():
    if not os.path.exists(MODEL_PATH):
        return None
    try:
        model = joblib.load(MODEL_PATH)
        return model
    except:
        return None

model = load_model()

def predict_cgpa(input_data: dict):
    if model is None:
        return 0.0
    try:
       
        expected_features = [
            'Previous_Semester_GPA',
            'Midterm_Score_Average',
            'Assignment_Score_Average',
            'Twelfth_Grade_Percentage',
            'Tenth_Grade_Percentage',
            'Study_Hours_Per_Day',
            'Attendance_Percentage',
            'Number_of_Backlogs',
            'Mental_Stress_Score',
            'Distance_From_Campus_KM'
        ]

        df = pd.DataFrame([input_data])

        df = df[expected_features]

        prediction = model.predict(df)
        return float(prediction[0])
    except Exception as e:
        print("Prediction error:", e)
        return 0.0