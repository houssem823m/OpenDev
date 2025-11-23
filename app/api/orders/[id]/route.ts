import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { updateOrderSchema } from "@/lib/validations";
import mongoose from "mongoose";

// GET /api/orders/[id] - Get a single order
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
          message: "Invalid order ID",
        },
        { status: 400 }
      );
    }

    const order = await Order.findById(params.id).populate("serviceId");

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: "Order retrieved successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error.message || "Failed to retrieve order",
      },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Update an order (mainly status)
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
          message: "Invalid order ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateOrderSchema.parse(body);

    const order = await Order.findByIdAndUpdate(
      params.id,
      { status: validatedData.status },
      { new: true, runValidators: true }
    ).populate("serviceId");

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: "Order updated successfully",
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
        message: error.message || "Failed to update order",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - Delete an order
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
          message: "Invalid order ID",
        },
        { status: 400 }
      );
    }

    const order = await Order.findByIdAndDelete(params.id);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: null,
      message: "Order deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error.message || "Failed to delete order",
      },
      { status: 500 }
    );
  }
}

