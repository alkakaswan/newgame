import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import DB from "./mongodb";
import mongoose, { Document, Schema } from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface User {
  _id?: string;
  email: string;
  name: string;
  password?: string;
  xp: number;
  level: number;
  streak: number;
  lastAction: string;
  joinDate: string;
  achievements: string[];
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

// Extend Mongoose Document for strict typing
interface UserDocument extends Document {
  email: string;
  name: string;
  password: string;
  xp: number;
  level: number;
  streak: number;
  lastAction?: string;
  joinDate?: string;
  achievements: string[];
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition
const userSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastAction: { type: String },
  joinDate: { type: String },
  achievements: { type: [String], default: [] },
  totalPoints: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);

// Map MongoDB doc to plain User object
function mapToUser(doc: UserDocument): User {
  return {
   _id: (doc._id as mongoose.Types.ObjectId).toString(),
    email: doc.email,
    name: doc.name,
    xp: doc.xp,
    level: doc.level,
    streak: doc.streak,
    lastAction: doc.lastAction ?? new Date().toISOString(), // fallback to string
    joinDate: doc.joinDate ?? new Date().toISOString(),     // fallback to string
    achievements: doc.achievements,
    totalPoints: doc.totalPoints,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// JWT utilities
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

// Create a new user
export async function createUser(userData: {
  email: string;
  name: string;
  password: string;
}): Promise<User> {
  await DB();

  const existingUser = await UserModel.findOne({ email: userData.email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await hashPassword(userData.password);
  const now = new Date().toISOString();

  const userDoc = new UserModel({
    email: userData.email,
    name: userData.name,
    password: hashedPassword,
    lastAction: now,
    joinDate: now,
    createdAt: new Date(now),
    updatedAt: new Date(now),
  });

  await userDoc.save();
  return mapToUser(userDoc);
}

// Authenticate user
export async function authenticateUser(email: string, password: string): Promise<User> {
  await DB();

  const user = await UserModel.findOne({ email });
  if (!user || !user.password) throw new Error("Invalid credentials");

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  user.lastAction = new Date().toISOString();
  user.updatedAt = new Date();
  await user.save();

  return mapToUser(user);
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  await DB();
  const user = await UserModel.findById(userId);
  return user ? mapToUser(user) : null;
}

// Update user fields
export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  await DB();

  const safeUpdates: Partial<User> = {
    ...updates,
    updatedAt: new Date(),
    lastAction: updates.lastAction ?? new Date().toISOString(), // Ensure string
  };

  const user = await UserModel.findByIdAndUpdate(userId, safeUpdates, { new: true });
  return user ? mapToUser(user) : null;
}
