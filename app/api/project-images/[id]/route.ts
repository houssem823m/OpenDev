import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ProjectImage from "@/lib/models/ProjectImage";
import mongoose from "mongoose";

// DELETE /api/project-images/[id] - Delete a project image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Invalid image ID",
        },
        { status: 400 }
      );
    }

    const image = await ProjectImage.findByIdAndDelete(params.id);

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Project image not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: null,
      message: "Project image deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error.message || "Failed to delete project image",
      },
      { status: 500 }
    );
  }
}

