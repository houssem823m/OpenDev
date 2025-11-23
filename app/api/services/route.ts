import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Service from "@/lib/models/Service";
import { createServiceSchema } from "@/lib/validations";
import { FALLBACK_NOTICE, fallbackServices } from "@/lib/data/fallback";

// GET /api/services - List all services
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const preview = searchParams.get("preview") === "true";
    
    const query: any = {};
    if (!preview) {
      query.isArchived = { $ne: true };
    }
    
    const services = await Service.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: services,
      message: "Services retrieved successfully",
    });
  } catch (error: any) {
    const allowFallback =
      process.env.ALLOW_STATIC_FALLBACK !== "false" && process.env.NODE_ENV !== "production";

    if (allowFallback) {
      console.warn("⚠️  Falling back to static services list:", error?.message);
      return NextResponse.json({
        success: true,
        data: fallbackServices,
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
        message: error?.message || "Failed to retrieve services",
      },
      { status: 500 }
    );
  }
}

// POST /api/services - Create a new service
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Validate input
    const validatedData = createServiceSchema.parse(body);

    // Check if slug already exists
    const existingService = await Service.findOne({ slug: validatedData.slug });
    if (existingService) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Service with this slug already exists",
        },
        { status: 400 }
      );
    }

    const service = await Service.create(validatedData);

    return NextResponse.json(
      {
        success: true,
        data: service,
        message: "Service created successfully",
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
        message: error.message || "Failed to create service",
      },
      { status: 500 }
    );
  }
}

