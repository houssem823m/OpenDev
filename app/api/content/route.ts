import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SiteContent from "@/lib/models/SiteContent";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET /api/content - Get site content
export async function GET() {
  try {
    await connectDB();
    let content = await SiteContent.findOne({});

    if (!content) {
      // Create default content if none exists
      content = await SiteContent.create({});
    }

    return NextResponse.json({
      success: true,
      data: content,
      message: "Content retrieved successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error.message || "Failed to retrieve content",
      },
      { status: 500 }
    );
  }
}

// PUT /api/content - Update site content (admin only)
export async function PUT(request: NextRequest) {
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

    let content = await SiteContent.findOne({});
    if (!content) {
      content = await SiteContent.create(body);
    } else {
      content = await SiteContent.findOneAndUpdate({}, body, { new: true });
    }

    return NextResponse.json({
      success: true,
      data: content,
      message: "Content updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error.message || "Failed to update content",
      },
      { status: 500 }
    );
  }
}

