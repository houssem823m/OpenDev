import dotenv from "dotenv";
import { resolve } from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../lib/models/User";

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), ".env.local") });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: resolve(process.cwd(), ".env") });
}

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set");
  process.exit(1);
}

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@opendev.com" });
    if (existingAdmin) {
      console.log("ℹ️  Admin user already exists:", existingAdmin.email);
      console.log("   To create a new admin, use a different email.");
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      name: "Admin User",
      email: "admin@opendev.com",
      password: hashedPassword,
      role: "admin",
      isBanned: false,
      isVerified: true,
    });

    console.log("✅ Admin user created successfully!");
    console.log("   Email: admin@opendev.com");
    console.log("   Password: admin123");
    console.log("   Role: admin");
    console.log("\n⚠️  IMPORTANT: Change the password after first login!");

    process.exit(0);
  } catch (error: any) {
    console.error("❌ Failed to create admin user:", error.message);
    process.exit(1);
  }
}

createAdmin();



