import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AdminAction from "@/lib/models/AdminAction";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET /api/admin-actions - Get recent admin actions
export async function GET(request: NextRequest) {
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
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const actions = await AdminAction.find({})
      .populate("adminId", "name email")
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: actions,
      message: "Admin actions retrieved successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error.message || "Failed to retrieve admin actions",
      },
      { status: 500 }
    );
  }
}

// POST /api/admin-actions - Create admin action (internal use)
export async function POST(request: NextRequest) {
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
    const body = await request.json();

    const action = await AdminAction.create({
      adminId: (session.user as any).id,
      ...body,
    });

    return NextResponse.json(
      {
        success: true,
        data: action,
        message: "Admin action logged",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error.message || "Failed to log admin action",
      },
      { status: 500 }
    );
  }
}

