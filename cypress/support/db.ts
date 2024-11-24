import fs from "fs/promises";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");
const UPLOADS_DIR = path.join(process.cwd(), "public/uploads/profile-pictures");

export async function clearUsers() {
  try {
    // Clear users.json
    await fs.writeFile(USERS_FILE, "[]");

    // Clear uploaded files
    const files = await fs.readdir(UPLOADS_DIR);
    await Promise.all(
      files.map((file) => fs.unlink(path.join(UPLOADS_DIR, file)))
    );
  } catch (error) {
    console.error("Error clearing test data:", error);
  }
}

export const setupTestUser = (userData: Record<string, string | File>) => {
  const formData = new FormData();
  Object.entries(userData).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return cy.request({
    method: "POST",
    url: "/api/setup-test-user",
    body: formData,
    headers: {
      // Remove Content-Type to let the browser set it with the boundary
      "Content-Type": null as any,
    },
  });
};
