import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import SiteContent from "@/lib/models/SiteContent";
import { createOrderSchema } from "@/lib/validations";
import { sendOrderNotificationEmail } from "@/lib/utils/email";

// GET /api/orders - List orders with filtering, pagination, and search
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const status = searchParams.get("status");
    const serviceId = searchParams.get("serviceId");
    const q = searchParams.get("q");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build query
    const query: any = {};

    if (status && ["pending", "in_progress", "done", "cancelled"].includes(status)) {
      query.status = status;
    }

    if (serviceId) {
      query.serviceId = serviceId;
    }

    if (from || to) {
      query.createdAt = {};
      if (from) {
        query.createdAt.$gte = new Date(from);
      }
      if (to) {
        query.createdAt.$lte = new Date(to);
      }
    }

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { message: { $regex: q, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("serviceId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: orders,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      message: "Orders retrieved successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error.message || "Failed to retrieve orders",
      },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Validate input
    const validatedData = createOrderSchema.parse(body);

    // Verify service exists
    const Service = (await import("@/lib/models/Service")).default;
    const service = await Service.findById(validatedData.serviceId);
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

    const order = await Order.create({
      serviceId: validatedData.serviceId,
      name: validatedData.name,
      email: validatedData.email,
      message: validatedData.message,
      fileUrl: validatedData.fileUrl || undefined,
    });

    const populatedOrder = await Order.findById(order._id).populate("serviceId");

    // Send email notifications if enabled
    try {
      const siteContent = await SiteContent.findOne({});
      const emailEnabled = siteContent?.footer?.email || process.env.ADMIN_EMAIL;
      
      if (emailEnabled && process.env.SENDGRID_API_KEY) {
        const Service = (await import("@/lib/models/Service")).default;
        const service = await Service.findById(validatedData.serviceId);
        await sendOrderNotificationEmail(emailEnabled, {
          orderId: order._id.toString(),
          serviceName: service?.title || "Service",
          customerName: validatedData.name,
          customerEmail: validatedData.email,
          message: validatedData.message,
          fileUrl: validatedData.fileUrl,
        });
      }
    } catch (emailError) {
      // Don't fail order creation if email fails
      console.error("Email notification failed:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        data: populatedOrder,
        message: "Order created successfully",
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
        message: error.message || "Failed to create order",
      },
      { status: 500 }
    );
  }
}

