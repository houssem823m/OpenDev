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

async function verifyAndFixAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const email = "admin@opendev.com";
    const password = "admin123";

    // Check if admin exists
    let admin = await User.findOne({ email: email.toLowerCase().trim() });

    if (admin) {
      console.log("📋 Found existing admin user:");
      console.log(`   Email: ${admin.email}`);
      console.log(`   Name: ${admin.name}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   isBanned: ${admin.isBanned}`);
      console.log(`   isVerified: ${admin.isVerified}`);
      console.log(`   Password hash: ${admin.password.substring(0, 20)}...`);

      // Test password
      const isValid = await bcrypt.compare(password, admin.password);
      console.log(`\n🔐 Password test: ${isValid ? "✅ VALID" : "❌ INVALID"}`);

      if (!isValid) {
        console.log("\n⚠️  Password doesn't match! Updating password...");
        const hashedPassword = await bcrypt.hash(password, 10);
        admin.password = hashedPassword;
        await admin.save();
        console.log("✅ Password updated!");
      }

      // Ensure isVerified is true
      if (!admin.isVerified) {
        console.log("\n⚠️  User is not verified! Setting isVerified to true...");
        admin.isVerified = true;
        await admin.save();
        console.log("✅ User verified!");
      }

      // Ensure isBanned is false
      if (admin.isBanned) {
        console.log("\n⚠️  User is banned! Setting isBanned to false...");
        admin.isBanned = false;
        await admin.save();
        console.log("✅ User unbanned!");
      }

      // Ensure role is admin
      if (admin.role !== "admin") {
        console.log("\n⚠️  User role is not admin! Setting role to admin...");
        admin.role = "admin";
        await admin.save();
        console.log("✅ Role updated to admin!");
      }
    } else {
      console.log("❌ Admin user not found. Creating new admin...");
      const hashedPassword = await bcrypt.hash(password, 10);
      admin = await User.create({
        name: "Admin User",
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: "admin",
        isBanned: false,
        isVerified: true,
      });
      console.log("✅ Admin user created!");
    }

    console.log("\n✅ Final admin user status:");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   isBanned: ${admin.isBanned}`);
    console.log(`   isVerified: ${admin.isVerified}`);

    // Final password test
    const finalTest = await bcrypt.compare(password, admin.password);
    console.log(`   Password test: ${finalTest ? "✅ VALID" : "❌ INVALID"}`);

    console.log("\n🎉 Admin user is ready!");
    console.log("\n📝 Login credentials:");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${password}`);
    console.log(`\n⚠️  IMPORTANT: Change the password after first login!`);

    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    console.error(error);
    process.exit(1);
  }
}

verifyAndFixAdmin();

