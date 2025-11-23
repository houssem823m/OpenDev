import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Service from "@/lib/models/Service";
import { updateServiceSchema } from "@/lib/validations";
import mongoose from "mongoose";
import { FALLBACK_NOTICE, fallbackServices } from "@/lib/data/fallback";

// GET /api/services/[id] - Get service by ID or slug
// If param is ObjectId, fetch by ID; otherwise fetch by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    let service;
    if (mongoose.Types.ObjectId.isValid(params.id)) {
      // Treat as ObjectId
      service = await Service.findById(params.id);
    } else {
      // Treat as slug
      service = await Service.findOne({ slug: params.id });
    }

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Service not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: service,
      message: "Service retrieved successfully",
    });
  } catch (error: any) {
    const allowFallback =
      process.env.ALLOW_STATIC_FALLBACK !== "false" && process.env.NODE_ENV !== "production";

    if (allowFallback) {
      const fallbackService = fallbackServices.find(
        (service) => service._id === params.id || service.slug === params.id
      );

      if (fallbackService) {
        return NextResponse.json({
          success: true,
          data: fallbackService,
          message: FALLBACK_NOTICE,
          meta: { fallback: true, reason: error?.message },
        });
      }
    }

    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error?.message || "Failed to retrieve service",
      },
      { status: 500 }
    );
  }
}

// PUT /api/services/[id] - Update a service
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
          message: "Invalid service ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateServiceSchema.parse(body);
    
    // Handle isArchived separately (not in schema)
    const isArchived = body.isArchived;

    // Check if slug is being updated and if it already exists
    if (validatedData.slug) {
      const existingService = await Service.findOne({
        slug: validatedData.slug,
        _id: { $ne: params.id },
      });
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
    }

    const updateData: any = { ...validatedData };
    if (typeof isArchived === "boolean") {
      updateData.isArchived = isArchived;
    }
    
    const service = await Service.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Service not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: service,
      message: "Service updated successfully",
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
        message: error.message || "Failed to update service",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/services/[id] - Delete a service
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
          message: "Invalid service ID",
        },
        { status: 400 }
      );
    }

    const service = await Service.findByIdAndDelete(params.id);

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Service not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: null,
      message: "Service deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error.message || "Failed to delete service",
      },
      { status: 500 }
    );
  }
}

