import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import { logAdminAction } from "@/lib/utils/adminActions";

// PUT /api/users/[id]/ban - Toggle user ban (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { isBanned } = body;

    if (typeof isBanned !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "isBanned must be a boolean",
        },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      params.id,
      { isBanned },
      { new: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Log admin action
    await logAdminAction(
      (session.user as any).id,
      isBanned ? "ban_user" : "unban_user",
      "user",
      params.id,
      { isBanned }
    );

    return NextResponse.json({
      success: true,
      data: user,
      message: `User ${isBanned ? "banned" : "unbanned"} successfully`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error.message || "Failed to update user ban status",
      },
      { status: 500 }
    );
  }
}

