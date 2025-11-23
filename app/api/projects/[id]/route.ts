import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import { updateProjectSchema } from "@/lib/validations";
import mongoose from "mongoose";
import { FALLBACK_NOTICE, fallbackProjects } from "@/lib/data/fallback";

// GET /api/projects/[id] - Get a single project
export async function GET(
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
          message: "Invalid project ID",
        },
        { status: 400 }
      );
    }

    const project = await Project.findById(params.id);

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

    return NextResponse.json({
      success: true,
      data: project,
      message: "Project retrieved successfully",
    });
  } catch (error: any) {
    const allowFallback =
      process.env.ALLOW_STATIC_FALLBACK !== "false" && process.env.NODE_ENV !== "production";

    if (allowFallback) {
      const fallbackProject = fallbackProjects.find(
        (project) => project._id === params.id
      );

      if (fallbackProject) {
        return NextResponse.json({
          success: true,
          data: fallbackProject,
          message: FALLBACK_NOTICE,
          meta: { fallback: true, reason: error?.message },
        });
      }
    }

    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error?.message || "Failed to retrieve project",
      },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(
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
          message: "Invalid project ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateProjectSchema.parse(body);
    
    // Handle isArchived separately (not in schema)
    const isArchived = body.isArchived;

    const updateData: any = { ...validatedData };
    if (typeof isArchived === "boolean") {
      updateData.isArchived = isArchived;
    }
    
    const project = await Project.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

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

    return NextResponse.json({
      success: true,
      data: project,
      message: "Project updated successfully",
    });
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
        message: error.message || "Failed to update project",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete a project
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
          message: "Invalid project ID",
        },
        { status: 400 }
      );
    }

    const project = await Project.findByIdAndDelete(params.id);

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

    return NextResponse.json({
      success: true,
      data: null,
      message: "Project deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error.message || "Failed to delete project",
      },
      { status: 500 }
    );
  }
}

