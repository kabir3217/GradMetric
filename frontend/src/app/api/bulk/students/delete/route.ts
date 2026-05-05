import { NextResponse } from "next/server";
import csv from "csvtojson";
import { connect } from "@/lib/db";
import Student from "@/lib/models/Student";

export async function POST(req: Request) {
  await connect();

  const form = await req.formData();
  const file = form.get("file") as File;
  const csvText = await file.text();
  const rows = await csv().fromString(csvText);

  const rollNos = rows.map(r => r.rollNo);

  await Student.deleteMany({
    rollNo: { $in: rollNos },
  });

  return NextResponse.json({
    success: true,
    deleted: rollNos.length,
  });
}
