import { NextResponse } from "next/server";
import { createUser, type UserInput } from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  // Only allow in test environment
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(
      JSON.stringify({ error: "Not allowed in production" }),
      {
        status: 403,
      }
    );
  }

  try {
    let userData: UserInput;
    let profilePicture: File | null = null;

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      userData = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
      };
      profilePicture = formData.get("profilePicture") as File | null;
    } else {
      // Handle JSON request
      const body = await request.json();
      userData = {
        email: body.email,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName,
      };
    }

    if (profilePicture) {
      // Generate a unique filename
      const fileExtension = profilePicture.name.split(".").pop() || "jpg";
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = path.join(
        process.cwd(),
        "public/uploads/profile-pictures",
        fileName
      );

      // Convert File to Buffer and save it
      const arrayBuffer = await profilePicture.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await writeFile(filePath, buffer);

      // Store the relative path in the user data
      userData.profilePicture = `/uploads/profile-pictures/${fileName}`;
    }

    await createUser(userData);
    return new NextResponse(JSON.stringify({ success: true }), {
      status: 201, // Changed to match test expectation
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create user" }),
      {
        status: 500,
      }
    );
  }
}
