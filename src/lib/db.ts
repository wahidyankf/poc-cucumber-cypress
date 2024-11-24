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

export async function getUsers(): Promise<User[]> {
  await ensureDbExists();
  const data = await fs.readFile(USERS_FILE, "utf-8");
  return JSON.parse(data);
}

export async function saveUsers(users: User[]): Promise<void> {
  await ensureDbExists();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function findUser(
  email: string,
  password: string
): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.email === email && u.password === password);
}

export async function createUser(user: UserInput): Promise<void> {
  const users = await getUsers();
  const existingUserIndex = users.findIndex((u) => u.email === user.email);

  // Convert UserInput to User (ensuring profilePicture is a string or undefined)
  const userToSave: User = {
    ...user,
    profilePicture:
      typeof user.profilePicture === "string" ? user.profilePicture : undefined,
  };

  if (existingUserIndex !== -1) {
    users[existingUserIndex] = userToSave;
  } else {
    users.push(userToSave);
  }

  await saveUsers(users);
}
