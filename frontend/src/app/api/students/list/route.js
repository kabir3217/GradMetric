import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Student from "@/lib/models/Student";

// Force dynamic so it fetches fresh data every time (fixes "data not updating")
export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await connect();

    // 1. Fetch all student records sorted by newest first
    const students = await Student.find({}).sort({ createdAt: -1 }).lean();

    // 2. Fix _id serialization (converts MongoDB ObjectId to simple string)
    const formattedStudents = students.map(student => ({
      ...student,
      _id: student._id.toString(),
      // Ensure specific fields exist so frontend doesn't crash
      status: student.status || "UNKNOWN", 
      cgpaPrediction: student.cgpaPrediction || null
    }));

    return NextResponse.json(formattedStudents);

  } catch (error) {
    console.error("Error fetching student list:", error);
    return NextResponse.json(
      { message: "Failed to load student records", error: error.message },
      { status: 500 }
    );
  }
}