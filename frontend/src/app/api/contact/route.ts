import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Contact from "@/lib/models/Contact";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Simple validation
    if (!name || !email || !subject || !message) {
        return NextResponse.json(
            { message: "All fields are required" },
            { status: 400 }
        );
    }

    await connect();

    // Create the record
    await Contact.create({
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { message: "Failed to send message" },
      { status: 500 }
    );
  }
}