import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import statsmodels.api as sm

print("Starting the model creation process...")

filename = 'student_cgpa_data.csv'
try:
    df = pd.read_csv(filename)
    print(f"CSV data file '{filename}' loaded successfully.")
except FileNotFoundError:
    print(f"\n--- ERROR: File '{filename}' not found. ---")
    exit() 

features = [
    'Previous_Semester_GPA', 
    'Midterm_Score_Average', 
    'Assignment_Score_Average', 
    'Twelfth_Grade_Percentage', 
    'Study_Hours_Per_Day', 
    'Attendance_Percentage', 
    'Number_of_Backlogs', 
    'Mental_Stress_Score'
]

X = df[features]
y = df['CGPA']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)
print("Model training complete.")

y_pred = model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

n = len(y_test) 
k = len(features) 
adj_r2 = 1 - (1 - r2) * (n - 1) / (n - k - 1)

X_train_sm = sm.add_constant(X_train) 
ols_model = sm.OLS(y_train, X_train_sm).fit()
p_values = ols_model.pvalues

print("\n" + "="*40)
print("       MODEL PERFORMANCE REPORT       ")
print("="*40)
print(f"Root Mean Squared Error (RMSE):  {rmse:.4f}")
print(f"R-Squared Value:                 {r2:.4f}")
print(f"Adjusted R-Squared:              {adj_r2:.4f}")
print("-" * 40)
print("Feature Significance (P-Values):")
print("-" * 40)
print(p_values.round(4))

model_filename = 'cgpa_model1.pkl'
joblib.dump(model, model_filename)
print(f"\nSuccess! Model saved as '{model_filename}'.")