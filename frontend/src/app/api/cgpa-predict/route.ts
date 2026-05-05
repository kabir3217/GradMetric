import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Student from "@/lib/models/Student";

// This route is primarily for server-to-server use (e.g., called by the analyze-voice route).
export async function POST(req: Request) {
  try {
    await connect(); // Connect here in case it's called independently
    const form = await req.json(); 
    // We extract studentId if provided, but the core task is prediction
    const { studentId, ...predictPayload } = form; 

    // forward to python backend
    const pythonBase = process.env.BACKEND_API_BASE;
    const r = await fetch(`${pythonBase}/predict-cgpa`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(predictPayload),
    });
    
    if (!r.ok) {
        const errorData = await r.json();
        return NextResponse.json(
            { message: errorData.detail || "Predict API error" }, 
            { status: 502 }
        );
    }
    
    const j = await r.json();
    if (studentId) {
      await Student.findByIdAndUpdate(studentId, { 
        cgpaPrediction: j.predicted_cgpa, 
        academicStatus: j.academic_status
      });
    }
    
    return NextResponse.json(j); // Return prediction results
  } catch (err) {
    console.error("cgpa-predict error", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}