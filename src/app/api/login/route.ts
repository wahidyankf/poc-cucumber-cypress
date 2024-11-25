import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findUser } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email = "", password = "" } = body;

    // Let HTML5 validation handle empty fields
    const user = await findUser(email.trim(), password.trim());

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401 }
      );
    }

    // Set auth cookie
    cookies().set("auth-token", "dummy-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    // Return user data for localStorage
    return new NextResponse(
      JSON.stringify({
        success: true,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        bio: user.bio || "",
        gender: user.gender || "",
      }),
      { status: 200 }
    );
  } catch (error) {
    // For any error (including JSON parse), treat as invalid credentials
    return new NextResponse(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
    });
  }
}
