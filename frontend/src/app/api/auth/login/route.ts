import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Teacher from "@/lib/models/Teacher";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const loginSchema = z.object({
  credential: z.string().min(3, "Email/Username is required"),
  password: z.string().min(6, "Password must be at least 6 chars"),
});

export async function POST(req: Request) {
  try {
    await connect();

    const body = await req.json();
    const { credential, password } = loginSchema.parse(body);

    // Allow login using username OR email
    const teacher = await Teacher.findOne({
      $or: [{ email: credential }, { username: credential }],
    });

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: teacher._id, email: teacher.email, role: "teacher" },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        username: teacher.username,
        email: teacher.email,
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("LOGIN ERROR:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
