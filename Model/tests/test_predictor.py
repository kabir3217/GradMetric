import os
import sys
import pytest

# Ensure we can import the local module when pytest runs from repo root
tests_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(tests_dir)
sys.path.insert(0, project_root)

from cgpa_predictor import predict_cgpa, MODEL_PATH


def test_model_file_exists():
    assert os.path.exists(MODEL_PATH), f"Model file not found at {MODEL_PATH}"


def test_predict_sample():
    sample = {
        'Previous_Semester_GPA': 8.0,
        'Midterm_Score_Average': 85,
        'Assignment_Score_Average': 90,
        'Twelfth_Grade_Percentage': 88,
        'Study_Hours_Per_Day': 5,
        'Attendance_Percentage': 95,
        'Number_of_Backlogs': 0,
        'Mental_Stress_Score': 3
    }

    pred = predict_cgpa(sample)
    assert isinstance(pred, float)
    # Reasonable sanity check: prediction should be between 0 and 10 for CGPA scale
    assert 0.0 <= pred <= 10.0
