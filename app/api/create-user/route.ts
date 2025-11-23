import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";

/**
 * CREATE USER ENDPOINT
 * 
 * Creates a new user in the database.
 * 
 * Usage:
 * GET /api/create-user?email=user@example.com&password=password123&name=User%20Name&role=admin&secret=create-user-2024
 * 
 * Parameters:
 * - email: User email (required)
 * - password: User password (required, min 6 chars)
 * - name: User name (required)
 * - role: 'admin' or 'user' (optional, default: 'user')
 * - secret: Security secret (required)
 */
export async function GET(request: NextRequest) {
  try {
    console.log("👤 [CREATE-USER] Endpoint called...");
    
    // Security check
    const secret = request.nextUrl.searchParams.get("secret");
    const expectedSecret = process.env.CREATE_USER_SECRET || "create-user-2024";
    
    if (secret !== expectedSecret) {
      return NextResponse.json(
        { 
          error: "Unauthorized",
          message: "Add ?secret=create-user-2024 to the URL",
          example: "https://opendev.onrender.com/api/create-user?email=user@example.com&password=pass123&name=User%20Name&role=admin&secret=create-user-2024"
        },
        { status: 401 }
      );
    }

    // Get parameters
    const email = request.nextUrl.searchParams.get("email");
    const password = request.nextUrl.searchParams.get("password");
    const name = request.nextUrl.searchParams.get("name");
    const role = request.nextUrl.searchParams.get("role") || "user";

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { 
          error: "Missing required parameters",
          required: ["email", "password", "name"],
          optional: ["role"],
          example: "https://opendev.onrender.com/api/create-user?email=user@example.com&password=pass123&name=User%20Name&role=admin&secret=create-user-2024"
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { 
          error: "Password must be at least 6 characters long" 
        },
        { status: 400 }
      );
    }

    if (role !== "admin" && role !== "user") {
      return NextResponse.json(
        { 
          error: "Role must be 'admin' or 'user'" 
        },
        { status: 400 }
      );
    }

    console.log("🔍 [CREATE-USER] Connecting to database...");
    await connectDB();
    console.log("✅ [CREATE-USER] Database connected");

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { 
          error: "User already exists",
          email: normalizedEmail,
          message: "A user with this email already exists in the database"
        },
        { status: 409 }
      );
    }

    // Hash password
    console.log("🔑 [CREATE-USER] Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    console.log("👤 [CREATE-USER] Creating user...");
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role as "admin" | "user",
      isBanned: false,
      isVerified: true,
    });

    console.log("✅ [CREATE-USER] User created:", user.email);

    // Verify password works
    const isValid = await bcrypt.compare(password, user.password);
    console.log(`🔑 [CREATE-USER] Password verification: ${isValid ? "✅ VALID" : "❌ INVALID"}`);

    return NextResponse.json({
      success: true,
      message: "User created successfully!",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isBanned: user.isBanned,
      },
      loginInfo: {
        email: user.email,
        password: password,
        note: "You can now login with these credentials",
      },
      nextSteps: [
        `1. Try logging in at: https://opendev.onrender.com/login`,
        `2. Use email: ${user.email}`,
        `3. Use password: ${password}`,
      ],
    });
  } catch (error: any) {
    console.error("❌ [CREATE-USER] Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to create user",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

