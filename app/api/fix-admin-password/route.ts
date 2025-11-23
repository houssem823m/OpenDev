import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";

/**
 * TEMPORARY ENDPOINT TO FIX ADMIN PASSWORD
 * 
 * This endpoint fixes the admin user password hash.
 * DELETE THIS FILE AFTER FIXING THE PASSWORD!
 * 
 * Usage:
 * 1. Visit: https://opendev.onrender.com/api/fix-admin-password
 * 2. The password will be reset to "admin123"
 * 3. Delete this file after use for security
 */
export async function GET(request: NextRequest) {
  try {
    console.log("🔧 [FIX-ADMIN] Endpoint called - fixing admin password...");
    
    // Simple security: Check for a secret token
    const secret = request.nextUrl.searchParams.get("secret");
    const expectedSecret = process.env.FIX_ADMIN_SECRET || "fix-admin-2024";
    
    if (secret !== expectedSecret) {
      console.log("❌ [FIX-ADMIN] Unauthorized access attempt");
      return NextResponse.json(
        { 
          error: "Unauthorized",
          message: "Add ?secret=fix-admin-2024 to the URL",
          example: "https://opendev.onrender.com/api/fix-admin-password?secret=fix-admin-2024"
        },
        { status: 401 }
      );
    }

    console.log("🔧 [FIX-ADMIN] Connecting to database...");
    await connectDB();
    console.log("✅ [FIX-ADMIN] Database connected");

    const email = "admin@opendev.com";
    const password = "admin123";

    // Find admin user
    console.log("🔍 [FIX-ADMIN] Looking for admin user...");
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      console.log("❌ [FIX-ADMIN] Admin user not found - creating new one...");
      // Create admin user if it doesn't exist
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name: "Admin User",
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: "admin",
        isBanned: false,
        isVerified: true,
      });
      
      const isValid = await bcrypt.compare(password, newUser.password);
      console.log(`✅ [FIX-ADMIN] Admin user created! Password test: ${isValid ? "VALID" : "INVALID"}`);
      
      return NextResponse.json({
        success: true,
        message: "Admin user created successfully!",
        action: "created",
        details: {
          email: newUser.email,
          role: newUser.role,
          isVerified: newUser.isVerified,
          isBanned: newUser.isBanned,
          passwordTest: isValid ? "✅ VALID" : "❌ INVALID",
        },
      });
    }

    console.log("✅ [FIX-ADMIN] Admin user found, updating password...");
    
    // Check current password
    const currentPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`🔑 [FIX-ADMIN] Current password test: ${currentPasswordValid ? "VALID" : "INVALID"}`);
    console.log(`🔑 [FIX-ADMIN] Current hash: ${user.password.substring(0, 30)}...`);

    // Generate new password hash
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔑 [FIX-ADMIN] Generated new password hash");

    // Update user
    user.password = hashedPassword;
    user.isVerified = true;
    user.isBanned = false;
    user.role = "admin";
    await user.save();
    console.log("✅ [FIX-ADMIN] User updated in database");

    // Verify the password works
    const isValid = await bcrypt.compare(password, user.password);
    console.log(`🔑 [FIX-ADMIN] Final password test: ${isValid ? "✅ VALID" : "❌ INVALID"}`);

    return NextResponse.json({
      success: true,
      message: "Admin password fixed successfully!",
      details: {
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isBanned: user.isBanned,
        passwordTest: isValid ? "✅ VALID" : "❌ INVALID",
      },
      instructions: [
        "1. Try logging in with: admin@opendev.com / admin123",
        "2. DELETE this file (app/api/fix-admin-password/route.ts) after successful login",
        "3. This endpoint should not remain in production for security reasons",
      ],
    });
  } catch (error: any) {
    console.error("Error fixing admin password:", error);
    return NextResponse.json(
      { 
        error: "Failed to fix admin password",
        message: error.message 
      },
      { status: 500 }
    );
  }
}

