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

export async function writeUsers(users: User[]): Promise<void> {
  try {
    await ensureDbExists();
    console.log("Writing users to file:", users);
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    console.log("Users written successfully");
  } catch (error) {
    console.error("Error writing users:", error);
    throw error;
  }
}

export async function clearUsers(): Promise<void> {
  try {
    console.log("Clearing all users");
    await writeUsers([]);
    console.log("Users cleared successfully");
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
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
      return {
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture
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

    // Normalize the user data
    const normalizedUser: User = {
      email: user.email || user.Email,
      password: user.password || user.Password,
      firstName: user.firstName || user['First Name'] || user.firstname,
      lastName: user.lastName || user['Last Name'] || user.lastname,
      profilePicture:
        typeof user.profilePicture === "string" ? user.profilePicture : undefined,
    };

    // Check if user already exists
    const existingUser = users.find((u) => (u.email || u.Email) === normalizedUser.email);
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
