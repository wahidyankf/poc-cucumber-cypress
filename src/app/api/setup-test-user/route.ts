import { createUser } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Only allow in non-production environments
    if (process.env.NODE_ENV === "production") {
      console.log("Test user setup blocked in production");
      return new NextResponse(
        JSON.stringify({ error: "Not allowed in production" }),
        { status: 403 }
      );
    }

    const contentType = request.headers.get("content-type");
    console.log("Setup test user request content-type:", contentType);

    let userData;
    if (contentType?.includes("application/json")) {
      userData = await request.json();
    } else if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();
      userData = Object.fromEntries(formData);
    } else {
      console.log("Unsupported content type:", contentType);
      return new NextResponse(
        JSON.stringify({ error: "Unsupported content type" }),
        { status: 400 }
      );
    }

    console.log("Setting up test user with data:", userData);

    // Normalize and trim field values
    const normalizedUserData = {
      email: (userData.email || userData.Email || "").trim(),
      password: (userData.password || userData.Password || "").trim(),
      firstName: (userData.firstName || userData["First Name"] || userData.firstname || "").trim(),
      lastName: (userData.lastName || userData["Last Name"] || userData.lastname || "").trim(),
    };

    console.log("Normalized user data:", normalizedUserData);

    // Create the test user
    await createUser(normalizedUserData);
    console.log("Test user created successfully");

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating test user:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create test user" }),
      { status: 500 }
    );
  }
}
