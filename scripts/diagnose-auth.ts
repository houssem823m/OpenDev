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

async function diagnoseAuth() {
  try {
    console.log("🔍 Starting authentication diagnosis...\n");
    
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const testEmail = "admin@opendev.com";
    const testPassword = "admin123";
    const normalizedEmail = testEmail.toLowerCase().trim();

    console.log("📋 Test Credentials:");
    console.log(`   Email: ${testEmail}`);
    console.log(`   Normalized: ${normalizedEmail}`);
    console.log(`   Password: ${testPassword}\n`);

    // Find user
    console.log("🔍 Searching for user...");
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.error("❌ USER NOT FOUND!");
      console.log("\n💡 Solutions:");
      console.log("   1. Run: npm run verify-admin");
      console.log("   2. Or create user manually in MongoDB Atlas");
      process.exit(1);
    }

    console.log("✅ User found!\n");

    // Display user details
    console.log("👤 User Details:");
    console.log(`   _id: ${user._id}`);
    console.log(`   name: ${user.name}`);
    console.log(`   email: ${user.email}`);
    console.log(`   role: ${user.role}`);
    console.log(`   isBanned: ${user.isBanned}`);
    console.log(`   isVerified: ${user.isVerified}`);
    console.log(`   createdAt: ${user.createdAt}\n`);

    // Check password field
    console.log("🔑 Password Field Analysis:");
    console.log(`   Has password: ${!!user.password}`);
    console.log(`   Password length: ${user.password?.length || 0}`);
    console.log(`   Password type: ${typeof user.password}`);
    
    if (user.password) {
      console.log(`   Password first 20 chars: ${user.password.substring(0, 20)}...`);
      console.log(`   Starts with $2a$: ${user.password.startsWith("$2a$")}`);
      console.log(`   Starts with $2b$: ${user.password.startsWith("$2b$")}`);
      console.log(`   Valid bcrypt format: ${user.password.startsWith("$2a$") || user.password.startsWith("$2b$")}`);
      
      if (!user.password.startsWith("$2a$") && !user.password.startsWith("$2b$")) {
        console.error("\n❌ INVALID PASSWORD HASH FORMAT!");
        console.log("   Password hash must start with $2a$ or $2b$");
        console.log("   Current hash appears to be invalid.\n");
      }
    } else {
      console.error("\n❌ PASSWORD FIELD IS MISSING OR EMPTY!");
    }

    // Test password comparison
    console.log("\n🔐 Testing Password Comparison:");
    if (!user.password) {
      console.error("❌ Cannot test password - password field is empty");
    } else if (!user.password.startsWith("$2a$") && !user.password.startsWith("$2b$")) {
      console.error("❌ Cannot test password - invalid hash format");
    } else {
      try {
        const isValid = await bcrypt.compare(testPassword, user.password);
        console.log(`   Result: ${isValid ? "✅ VALID" : "❌ INVALID"}`);
        
        if (!isValid) {
          console.error("\n❌ PASSWORD DOES NOT MATCH!");
          console.log("   The password 'admin123' does not match the stored hash.");
          console.log("   This means the hash in MongoDB is incorrect.\n");
        } else {
          console.log("   ✅ Password matches correctly!\n");
        }
      } catch (error: any) {
        console.error("❌ Error comparing password:", error.message);
      }
    }

    // Check email verification requirement
    console.log("📧 Email Verification Check:");
    const requireVerification = process.env.REQUIRE_EMAIL_VERIFICATION === "true";
    console.log(`   REQUIRE_EMAIL_VERIFICATION: ${process.env.REQUIRE_EMAIL_VERIFICATION || "not set"}`);
    console.log(`   Requires verification: ${requireVerification}`);
    console.log(`   User isVerified: ${user.isVerified}`);
    
    if (requireVerification && !user.isVerified) {
      console.error("\n❌ EMAIL NOT VERIFIED!");
      console.log("   Set isVerified to true in MongoDB Atlas\n");
    } else {
      console.log("   ✅ Email verification OK\n");
    }

    // Check if banned
    console.log("🚫 Ban Status Check:");
    console.log(`   isBanned: ${user.isBanned}`);
    if (user.isBanned) {
      console.error("\n❌ USER IS BANNED!");
      console.log("   Set isBanned to false in MongoDB Atlas\n");
    } else {
      console.log("   ✅ User is not banned\n");
    }

    // Summary
    console.log("📊 DIAGNOSIS SUMMARY:");
    const issues: string[] = [];
    
    if (!user.password || user.password.length < 60) {
      issues.push("❌ Password hash is missing or invalid");
    } else if (!user.password.startsWith("$2a$") && !user.password.startsWith("$2b$")) {
      issues.push("❌ Password hash format is invalid (must start with $2a$ or $2b$)");
    } else {
      const isValid = await bcrypt.compare(testPassword, user.password);
      if (!isValid) {
        issues.push("❌ Password hash does not match 'admin123'");
      }
    }
    
    if (requireVerification && !user.isVerified) {
      issues.push("❌ Email not verified (isVerified: false)");
    }
    
    if (user.isBanned) {
      issues.push("❌ User is banned (isBanned: true)");
    }

    if (issues.length === 0) {
      console.log("✅ All checks passed! User should be able to login.");
      console.log("\n💡 If login still fails, check:");
      console.log("   1. NEXTAUTH_SECRET is set correctly");
      console.log("   2. MongoDB connection is working");
      console.log("   3. Server logs for detailed error messages");
    } else {
      console.log("❌ Issues found:");
      issues.forEach(issue => console.log(`   ${issue}`));
      console.log("\n💡 Fix by running: npm run verify-admin");
    }

    process.exit(0);
  } catch (error: any) {
    console.error("❌ Diagnosis failed:", error.message);
    console.error(error);
    process.exit(1);
  }
}

diagnoseAuth();

