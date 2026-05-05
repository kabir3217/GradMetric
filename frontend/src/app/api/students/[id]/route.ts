import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Student from "@/lib/models/Student";

// === 1. EXISTING GET HANDLER ===
export async function GET (
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await connect();

    const student = await Student.findById(id).lean();

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(student);

  } catch (err) {
    console.error("Error fetching student:", err);
    return NextResponse.json(
      { message: "Server error fetching student" },
      { status: 500 }
    );
  }
}

// === 2. NEW DELETE HANDLER (Add this) ===
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await connect();

    // Find the student by ID and remove them
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Student deleted successfully" },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error deleting student:", err);
    return NextResponse.json(
      { message: "Server error deleting student" },
      { status: 500 }
    );
  }
}