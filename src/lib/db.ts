import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DB_PATH, "users.json");

export interface User {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string; // Path to the profile picture file
  phoneNumber?: string;
  bio?: string;
  gender?: string;
  address?: string;
}

export interface UserInput extends Omit<User, "profilePicture"> {
  profilePicture?: string | File; // Can be either a path (when saved) or a File (when uploading)
}

async function ensureDbExists() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(DB_PATH, { recursive: true });
  }

  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, JSON.stringify([]));
  }
}

export async function readUsers(): Promise<User[]> {
  try {
    await ensureDbExists();
    
    const data = await fs.readFile(USERS_FILE, "utf-8");
    const users = JSON.parse(data);
    console.log("Read users from file:", users);
    return users;
  } catch (error) {
    console.error("Error reading users:", error);
    return [];
  }
}

export const getUsers = readUsers; // Alias for readUsers

export async function writeUsers(users: User[]): Promise<void> {
  try {
    await ensureDbExists();
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error writing users:", error);
    throw error;
  }
}

export async function clearUsers(): Promise<void> {
  try {
    await ensureDbExists();
    await fs.writeFile(USERS_FILE, JSON.stringify([]));
  } catch (error) {
    console.error("Error clearing users:", error);
    throw error;
  }
}

export async function findUser(email: string | undefined, password: string | undefined): Promise<User | null> {
  try {
    if (!email || !password) return null;
    
    const users = await readUsers();
    const user = users.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim() && u.password.trim() === password.trim()
    );

    if (user) {
      return {
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        phoneNumber: user.phoneNumber,
        bio: user.bio,
        gender: user.gender,
        address: user.address,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function createUser(user: UserInput): Promise<void> {
  try {
    console.log("Creating new user:", user);
    const users = await readUsers();
    console.log("Existing users:", users);

    // Normalize and trim the user data
    const normalizedUser: User = {
      email: (user.email || "").trim(),
      password: (user.password || "").trim(),
      firstName: (user.firstName || "").trim(),
      lastName: (user.lastName || "").trim(),
      profilePicture:
        typeof user.profilePicture === "string"
          ? user.profilePicture.trim()
          : undefined,
      phoneNumber: user.phoneNumber?.trim(),
      bio: user.bio?.trim(),
      gender: user.gender?.trim(),
      address: user.address?.trim(),
    };

    // Check if user already exists (case-insensitive and trimmed comparison)
    const existingUser = users.find(
      (u) => (u.email || "").toLowerCase().trim() === normalizedUser.email.toLowerCase()
    );
    if (existingUser) {
      console.log("User already exists:", existingUser);
      throw new Error("User already exists");
    }

    users.push(normalizedUser);
    await writeUsers(users);
    console.log("User created successfully:", normalizedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
