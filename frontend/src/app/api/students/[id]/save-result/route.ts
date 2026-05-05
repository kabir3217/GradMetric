import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Student from "@/lib/models/Student";

export async function POST(req: Request, { params }: any) {
  try {
    await connect();
    const { id } = params;
    await Student.findByIdAndUpdate(id, { 
      status:  "COMPLETED" 
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
