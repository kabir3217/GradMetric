import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Student from "@/lib/models/Student";

export async function POST(req) {
  try {
    await connect();
    const body = await req.json();

    const { name, rollNo, college } = body;

    if (!name || !rollNo) {
      return NextResponse.json(
        { success: false, message: "Name and Roll No required" },
        { status: 400 }
      );
    }

    const student = await Student.create({
      name,
      rollNo,
      college: college || "",
      status: "PENDING_MANDATORY",
    });

    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error("CREATE STUDENT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
