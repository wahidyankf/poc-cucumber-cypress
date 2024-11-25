import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");
const UPLOADS_DIR = path.join(process.cwd(), "public/uploads/profile-pictures");

export async function POST(request: globalThis.Request) {
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
    console.log("Starting to clear test data...");

    // Ensure directories exist
    await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    console.log("Directories ensured");

    // Clear users.json
    await fs.writeFile(USERS_FILE, JSON.stringify([]));
    console.log("Users file cleared");

    // Clear uploaded files
    try {
      const files = await fs.readdir(UPLOADS_DIR);
      console.log("Found files to clear:", files);

      await Promise.all(
        files.map((file) => fs.unlink(path.join(UPLOADS_DIR, file)))
      );
      console.log("Profile pictures cleared");
    } catch (error) {
      if ((error as any).code !== "ENOENT") {
        throw error;
      }
      console.log("No profile pictures to clear");
    }

    console.log("Test data cleared successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing test data:", error);
    return NextResponse.json(
      { error: "Failed to clear test data" },
      { status: 500 }
    );
  }
}
