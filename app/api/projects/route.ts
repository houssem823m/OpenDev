import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import { createProjectSchema } from "@/lib/validations";
import { FALLBACK_NOTICE, fallbackProjects } from "@/lib/data/fallback";

// GET /api/projects - List all projects
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const preview = searchParams.get("preview") === "true";
    
    const query: any = {};
    if (!preview) {
      query.isArchived = { $ne: true };
    }
    
    const projects = await Project.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: projects,
      message: "Projects retrieved successfully",
    });
  } catch (error: any) {
    const allowFallback =
      process.env.ALLOW_STATIC_FALLBACK !== "false" && process.env.NODE_ENV !== "production";

    if (allowFallback) {
      console.warn("⚠️  Falling back to static projects list:", error?.message);
      return NextResponse.json({
        success: true,
        data: fallbackProjects,
        message: FALLBACK_NOTICE,
        meta: {
          fallback: true,
          reason: error?.message,
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error?.message || "Failed to retrieve projects",
      },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Validate input
    const validatedData = createProjectSchema.parse(body);

    const project = await Project.create(validatedData);

    return NextResponse.json(
      {
        success: true,
        data: project,
        message: "Project created successfully",
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
        message: error.message || "Failed to create project",
      },
      { status: 500 }
    );
  }
}

