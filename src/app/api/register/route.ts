import { NextResponse } from "next/server";
import { createUser, getUsers } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      passwordConfirmation,
      firstName,
      lastName,
      phoneNumber,
      address,
      gender,
      terms,
    } = body;

    // Validate required fields
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !address ||
      !gender
    ) {
      return new NextResponse(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    // Validate terms acceptance
    if (!terms) {
      return new NextResponse(
        JSON.stringify({ error: "You must accept the terms and conditions" }),
        { status: 400 }
      );
    }

    // Validate password match
    if (password !== passwordConfirmation) {
      return new NextResponse(
        JSON.stringify({ error: "Passwords do not match" }),
        { status: 400 }
      );
    }

    // Check if email already exists
    const users = await getUsers();
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ error: "Email already registered" }),
        { status: 409 }
      );
    }

    // Create new user
    await createUser({
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      address,
      gender,
    });

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 201,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to register user" }),
      { status: 500 }
    );
  }
}
