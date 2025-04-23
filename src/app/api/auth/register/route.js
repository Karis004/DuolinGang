import { createUser } from "../../../lib/dbUtils";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Simple validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 }
      );
    }

    // Create user
    const result = await createUser({ name, email, password });

    // Handle errors
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Registration successful
    return NextResponse.json({
      message: "Registration successful",
      user: result.user
    }, { status: 201 });
    
  } catch (error) {
    console.error("Registration failed:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}