import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ProjectImage from "@/lib/models/ProjectImage";
import { createProjectImageSchema } from "@/lib/validations";
import mongoose from "mongoose";

// GET /api/project-images?projectId=xxx - List all images for a project
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "projectId query parameter is required",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Invalid project ID",
        },
        { status: 400 }
      );
    }

    const images = await ProjectImage.find({
      projectId: projectId,
    });

    return NextResponse.json({
      success: true,
      data: images,
      message: "Project images retrieved successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error.message || "Failed to retrieve project images",
      },
      { status: 500 }
    );
  }
}

// POST /api/project-images - Add a project image
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Validate input
    const validatedData = createProjectImageSchema.parse(body);

    // Verify project exists
    const Project = (await import("@/lib/models/Project")).default;
    const project = await Project.findById(validatedData.projectId);
    if (!project) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Project not found",
        },
        { status: 404 }
      );
    }

    const projectImage = await ProjectImage.create({
      projectId: validatedData.projectId,
      imageUrl: validatedData.imageUrl,
    });

    return NextResponse.json(
      {
        success: true,
        data: projectImage,
        message: "Project image added successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Validation error",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error.message || "Failed to add project image",
      },
      { status: 500 }
    );
  }
}

