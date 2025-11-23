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
    // Security: Check for a secret token (optional but recommended)
    const secret = request.nextUrl.searchParams.get("secret");
    const expectedSecret = process.env.FIX_ADMIN_SECRET || "fix-admin-2024";
    
    if (secret !== expectedSecret) {
      return NextResponse.json(
        { 
          error: "Unauthorized. Add ?secret=fix-admin-2024 to the URL" 
        },
        { status: 401 }
      );
    }

    await connectDB();

    const email = "admin@opendev.com";
    const password = "admin123";

    // Find admin user
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return NextResponse.json(
        { 
          error: "Admin user not found. Run npm run seed first." 
        },
        { status: 404 }
      );
    }

    // Generate new password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user
    user.password = hashedPassword;
    user.isVerified = true;
    user.isBanned = false;
    user.role = "admin";
    await user.save();

    // Verify the password works
    const isValid = await bcrypt.compare(password, user.password);

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

