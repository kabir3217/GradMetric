import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Student from "@/lib/models/Student";
import { buildStudentSummary } from "@/lib/buildStudentSummary";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const pythonBase = process.env.BACKEND_API_BASE;
    const url = new URL(req.url);
    const studentId = url.searchParams.get("studentId");

    const body = await req.arrayBuffer();
    const contentType = req.headers.get("content-type") || "";

    // 1️⃣ Send audio to Python backend
    const voiceRes = await fetch(`${pythonBase}/analyze-voice`, {
      method: "POST",
      headers: { "content-type": contentType },
      body,
    });

    if (!voiceRes.ok) {
      const errorData = await voiceRes.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.detail || "Python analyze error" },
        { status: 502 }
      );
    }

    const voiceData = await voiceRes.json();
    console.log("✅ Voice Data from Python:", voiceData);

    if (!studentId) {
      return NextResponse.json({ success: true, voiceAnalysis: voiceData });
    }

    // 2️⃣ Connect DB and fetch student
    await connect();
    const student = await Student.findById(studentId).lean();
    if (!student) return NextResponse.json({ message: "Student not found" }, { status: 404 });

    // 3️⃣ Build CGPA prediction payload
    const predictionPayload = {
      Previous_Semester_GPA: student.modelInputs?.Previous_Semester_GPA,
      Midterm_Score_Average: student.modelInputs?.Midterm_Score_Average,
      Assignment_Score_Average: student.modelInputs?.Assignment_Score_Average,
      Twelfth_Grade_Percentage: student.modelInputs?.Twelfth_Grade_Percentage,
      Study_Hours_Per_Day: student.modelInputs?.Study_Hours_Per_Day,
      Tenth_Grade_Percentage: student.modelInputs?.Tenth_Grade_Percentage,
      Attendance_Percentage: student.modelInputs?.Attendance_Percentage,
      Number_of_Backlogs: student.modelInputs?.Number_of_Backlogs,
      Mental_Stress_Score: student.modelInputs?.Mental_Stress_Score,
      Distance_From_Campus_KM: student.modelInputs?.Distance_From_Campus_KM,
    };

    const predictRes = await fetch(`${pythonBase}/predict-cgpa`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(predictionPayload),
    });

    if (!predictRes.ok) {
      const err = await predictRes.json().catch(() => ({}));
      return NextResponse.json({ message: err.detail || "Prediction API failed" }, { status: 500 });
    }

    const prediction = await predictRes.json();
    console.log("🎯 Prediction Received:", prediction);

    // 4️⃣ Map Python voice data to MongoDB schema
    const mappedVoiceAnalysis = {
      clarity: voiceData["Clarity Score"] ?? null,
      confidence: voiceData["Confidence Score"] ?? null,                // new field
      energyEngagement: voiceData["Energy & Engagement Score"] ?? null, // new field
      professionalism: voiceData["Professionalism Score"] ?? null,     // new field
      summary: voiceData["Transcription"] ?? "",
      rawResponse: voiceData
    };

    // 5️⃣ Save everything in DB
// Fetch notes analysis to include in summary
const studentAfterNotes = await Student.findById(studentId).lean();

const summaryData = buildStudentSummary({
  cgpa: prediction.predicted_cgpa,
  notes: studentAfterNotes.notesAnalysis,
  voice: mappedVoiceAnalysis
});

const updatedStudent = await Student.findByIdAndUpdate(
  studentId,
  {
    voiceAnalysis: mappedVoiceAnalysis,
    cgpaPrediction: prediction.predicted_cgpa,
    academicStatus: prediction.academic_status,
    profileSummary: summaryData.summary,
    recommendations: summaryData.recommendations,
    status: "COMPLETED"
  },
  { new: true }
);


    console.log("💾 Updated Student Voice + Prediction:", updatedStudent);

    return NextResponse.json({
      success: true,
      message: "Voice analysis + CGPA prediction completed",
      voiceAnalysis: mappedVoiceAnalysis,
      prediction,
    });

  } catch (err) {
    console.error("🔥 Server Error in Voice Route:", err);
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}
