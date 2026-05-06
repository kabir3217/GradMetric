import pandas as pd
import numpy as np

NUM_ENTRIES = 50000
np.random.seed(42)  

prev_gpa = np.random.normal(loc=7.5, scale=1.2, size=NUM_ENTRIES)
prev_gpa = np.clip(prev_gpa, 4.0, 10.0)

study_hours = np.random.normal(loc=4.5, scale=2.0, size=NUM_ENTRIES)
study_hours = np.clip(study_hours, 0.5, 12.0)

attendance = np.random.normal(loc=85, scale=10, size=NUM_ENTRIES)
attendance = np.clip(attendance, 40.0, 100.0)

tenth_grade = np.random.normal(loc=88, scale=8, size=NUM_ENTRIES)
tenth_grade = np.clip(tenth_grade, 50.0, 100.0)

twelfth_grade = np.random.normal(loc=86, scale=9, size=NUM_ENTRIES)
twelfth_grade = np.clip(twelfth_grade, 50.0, 100.0)

distance = np.random.exponential(scale=8, size=NUM_ENTRIES) 
distance = np.clip(distance, 0.0, 60.0)

stress = np.random.randint(1, 11, size=NUM_ENTRIES)

backlogs = np.random.choice([0, 1, 2, 3, 4, 5], size=NUM_ENTRIES, p=[0.7, 0.15, 0.08, 0.04, 0.02, 0.01])

student_capability = (prev_gpa / 10) * 0.6 + (study_hours / 12) * 0.2 + (attendance / 100) * 0.2

midterm = student_capability * 100 + np.random.normal(0, 5, NUM_ENTRIES)
midterm = np.clip(midterm, 0.0, 100.0)

assignments = student_capability * 100 + np.random.normal(2, 4, NUM_ENTRIES)
assignments = np.clip(assignments, 0.0, 100.0)

estimated_cgpa = (
    (prev_gpa * 0.45) +                  
    ((midterm / 10) * 0.20) +          
    ((assignments / 10) * 0.10) +       
    ((attendance / 10) * 0.10) +    
    ((twelfth_grade / 10) * 0.05) + 
    (study_hours * 0.05) -            
    (backlogs * 0.15) -                   
    (stress * 0.01)                      
)

noise = np.random.normal(0, 0.2, NUM_ENTRIES) 
final_cgpa = estimated_cgpa + noise

final_cgpa = np.clip(final_cgpa, 0.0, 10.0)

data = pd.DataFrame({
    'Previous_Semester_GPA': np.round(prev_gpa, 2),
    'Midterm_Score_Average': np.round(midterm, 2),
    'Assignment_Score_Average': np.round(assignments, 2),
    'Twelfth_Grade_Percentage': np.round(twelfth_grade, 2),
    'Study_Hours_Per_Day': np.round(study_hours, 2),
    'Tenth_Grade_Percentage': np.round(tenth_grade, 2),
    'Attendance_Percentage': np.round(attendance, 2),
    'Number_of_Backlogs': backlogs,
    'Mental_Stress_Score': stress,
    'Distance_From_Campus_KM': np.round(distance, 2),
    'CGPA': np.round(final_cgpa, 2)
})

# Save to CSV
file_name = "student_cgpa_data.csv"
data.to_csv(file_name, index=False)

print(f"Successfully generated {NUM_ENTRIES} rows of data saved to '{file_name}'")
print(data.head(10))