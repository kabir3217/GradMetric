import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Student from "@/lib/models/Student";
import { appendCgpaRow } from "@/lib/cgpaCsvWriter";

export async function POST(req: Request, context: any) {
  try {
    await connect();

    const { id } = await context.params; 

    const body = await req.json();

    await appendCgpaRow(body);

    const updated = await Student.findByIdAndUpdate(
      id,
      {
        modelInputs: body,
        status: "PENDING_NOTES_ANALYSIS",
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

   

    return NextResponse.json({
      success: true,
      student: updated,
    });

  } catch (err) {
    console.error("Save academic inputs error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
