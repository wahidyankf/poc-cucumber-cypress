import { NextResponse } from "next/server";
import { createUser, getUsers } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const address = formData.get("address") as string;
    const gender = formData.get("gender") as string;
    const bio = formData.get("bio") as string;
    const terms = formData.get("terms") === "true";
    const profilePicture = formData.get("profilePicture") as File;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phoneNumber ||
      !address ||
      !gender ||
      !terms
    ) {
      return new NextResponse(
        JSON.stringify({ error: "All required fields must be filled" }),
        { status: 400 }
      );
    }

    // Handle profile picture
    let profilePictureUrl = "";
    if (profilePicture) {
      // In a real app, you would upload this to a storage service
      // For now, we'll just store the fact that we received it
      profilePictureUrl = URL.createObjectURL(profilePicture);
    }

    // Validate terms acceptance
    if (!terms) {
      return new NextResponse(
        JSON.stringify({ error: "You must accept the terms and conditions" }),
        { status: 400 }
      );
    }

    // Validate password match
    const passwordConfirmation = formData.get("passwordConfirmation") as string;
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
      bio,
      profilePicture,
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
