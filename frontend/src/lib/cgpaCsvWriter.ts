import fs from "fs";
import path from "path";

const CSV_PATH = path.join(process.cwd(), "student_cgpa_data.csv");

const HEADERS = [
  "Previous_Semester_GPA",
  "Midterm_Score_Average",
  "Assignment_Score_Average",
  "Twelfth_Grade_Percentage",
  "Tenth_Grade_Percentage",
  "Study_Hours_Per_Day",
  "Attendance_Percentage",
  "Number_of_Backlogs",
  "Mental_Stress_Score",
  "Distance_From_Campus_KM",
];

export function appendCgpaRow(data: Record<string, any>) {
  const row = HEADERS.map(h => data[h] ?? "").join(",") + "\n";

  // ✅ If file does NOT exist → create with headers
  if (!fs.existsSync(CSV_PATH)) {
    const headerLine = HEADERS.join(",") + "\n";
    fs.writeFileSync(CSV_PATH, headerLine + row);
    console.log("📄 CSV created + first row added");
    return;
  }

  // ✅ If file exists → APPEND ONLY
  fs.appendFileSync(CSV_PATH, row);
  console.log("➕ Row appended to existing CSV");
}
