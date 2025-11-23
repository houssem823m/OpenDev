import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { updateUserSchema } from "@/lib/validations";
import mongoose from "mongoose";

// PUT /api/users/[id] - Update a user (role, ban status)
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
          message: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    const user = await User.findByIdAndUpdate(
      params.id,
      validatedData,
      { new: true, runValidators: true }
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

    return NextResponse.json({
      success: true,
      data: user,
      message: "User updated successfully",
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
        message: error.message || "Failed to update user",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete a user
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
          message: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndDelete(params.id);

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

    return NextResponse.json({
      success: true,
      data: null,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error.message || "Failed to delete user",
      },
      { status: 500 }
    );
  }
}

