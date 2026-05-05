import { NextResponse } from "next/server";
import csv from "csvtojson";
import crypto from "crypto";
import { connect } from "@/lib/db";
import Student from "@/lib/models/Student";

export async function POST(req: Request) {
  try {
    await connect();

    const form = await req.formData();
    const file = form.get("file") as File;
    if (!file) return NextResponse.json({ message: "No file uploaded" }, { status: 400 });

    const csvText = await file.text();
    const rows = await csv().fromString(csvText);

    const bundleId = crypto.createHash("md5").update(file.name).digest("hex");

    // 1. Delete old bundle if re-uploaded
    await Student.deleteMany({ bundleId });

    // 2. Process rows
    for (const r of rows) {
      // Use findOneAndUpdate with 'upsert' to handle unique rollNo constraint safely
      await Student.findOneAndUpdate(
        { rollNo: r.rollNo }, 
        {
          name: r.name,
          college: r.college || "",
          bundleId,
          modelInputs: {
            Previous_Semester_GPA: Number(r.Previous_Semester_GPA) || 0,
            Midterm_Score_Average: Number(r.Midterm_Score_Average) || 0,
            Assignment_Score_Average: Number(r.Assignment_Score_Average) || 0,
            Twelfth_Grade_Percentage: Number(r.Twelfth_Grade_Percentage) || 0,
            Tenth_Grade_Percentage: Number(r.Tenth_Grade_Percentage) || 0,
            Study_Hours_Per_Day: Number(r.Study_Hours_Per_Day) || 0,
            Attendance_Percentage: Number(r.Attendance_Percentage) || 0,
            Number_of_Backlogs: Number(r.Number_of_Backlogs) || 0,
            Mental_Stress_Score: Number(r.Mental_Stress_Score) || 0,
            Distance_From_Campus_KM: Number(r.Distance_From_Campus_KM) || 0,
          },
          // Reset analysis fields for a fresh upload
          notesAnalysis: { text: "", keywords: [], analysis: {}, rawResponse: {} },
          voiceAnalysis: { summary: "", rawResponse: {} },
          cgpaPrediction: 0,
          academicStatus: "Pending Analysis",
          status: "PENDING_NOTES_ANALYSIS", // Now correctly starts the workflow
        },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({
      success: true,
      created: rows.length,
      bundleId,
    });

  } catch (error: any) {
    console.error("CSV Upload Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}