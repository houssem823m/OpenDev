import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

// GET /api/auth/verify?token= - Verify email token
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Token is required",
        },
        { status: 400 }
      );
    }

    const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "";
    if (!secret) {
      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error",
        },
        { status: 500 }
      );
    }

    try {
      const decoded = jwt.verify(token, secret) as { userId: string };
      const user = await User.findById(decoded.userId);

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            message: "User not found",
          },
          { status: 404 }
        );
      }

      if (user.verificationToken !== token) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid token",
          },
          { status: 400 }
        );
      }

      if (user.verificationTokenExpiry && user.verificationTokenExpiry < new Date()) {
        return NextResponse.json(
          {
            success: false,
            message: "Token expired",
          },
          { status: 400 }
        );
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiry = undefined;
      await user.save();

      return NextResponse.json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (jwtError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Verification failed",
      },
      { status: 500 }
    );
  }
}

