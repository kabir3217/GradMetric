import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Student from "@/lib/models/Student";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const pythonBase = process.env.BACKEND_API_BASE;
    const body = await req.arrayBuffer();
    const contentType = req.headers.get("content-type") || "";
    const url = new URL(req.url);
    const studentId = url.searchParams.get("studentId");

    const res = await fetch(`${pythonBase}/analyze-notes`, {
      method: "POST",
      headers: { "content-type": contentType },
      body,
    });

    if (!res.ok)
      return NextResponse.json({ message: "Python analyze error" }, { status: 502 });

    const j = await res.json();
    console.log("✅ Notes Data from Python:", j);

   if (studentId) {
  await connect();

  // Map Python output to schema
  const mappedNotesAnalysis = {
    text: j.ocr_extracted_text ?? "",
    sentiment: j.sentiment ?? "",                     // optional, if Python returns later
    score: j.focus_clarity_score ?? null,            // numeric clarity/focus score
    focusClarityScore: j.focus_clarity_score ?? null, // new field to match schema
    keywords: j.keywords ?? [],                      // if you implement keyword extraction in Python
    analysis: j.analysis ?? {},                      // detailed analysis explanation from Python
    rawResponse: j,                                  // store everything Python returned
  };

  const updatedStudent = await Student.findByIdAndUpdate(
    studentId,
    { notesAnalysis: mappedNotesAnalysis, status: "PENDING_VOICE_ANALYSIS" },
    { new: true }
  );

  console.log("💾 Updated Student Notes:", updatedStudent);
}


    return NextResponse.json(j);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
