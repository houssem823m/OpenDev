import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

// GET /api/health - Health check endpoint
export async function GET() {
  try {
    await connectDB();
    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        database: "connected",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: error.message,
      },
      { status: 503 }
    );
  }
}

