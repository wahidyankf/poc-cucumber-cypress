import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findUser } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  // Find user in JSON database
  const user = await findUser(email, password);

  if (!user) {
    return new NextResponse(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
    });
  }

  // Set auth cookie
  cookies().set("auth-token", "dummy-token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
  });
}
