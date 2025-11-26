import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
import { NextRequest, NextResponse } from "next/server";

// Log configuration on route handler creation
console.log("🔧 UploadThing v7 Route Handler initialized");
console.log("🔑 UPLOADTHING_SECRET:", process.env.UPLOADTHING_SECRET ? "✅ Set" : "❌ Missing");
console.log("🆔 UPLOADTHING_APP_ID:", process.env.UPLOADTHING_APP_ID ? "✅ Set" : "❌ Missing");
console.log("🌐 NEXTAUTH_URL:", process.env.NEXTAUTH_URL || "http://localhost:3000");

// In v7, createRouteHandler automatically handles callbacks and routing
// The callback URL is determined from the request origin
const { GET, POST: originalPOST } = createRouteHandler({
  router: ourFileRouter,
});

// Wrap POST to catch and log errors
async function POST(request: NextRequest) {
  try {
    console.log("📤 UploadThing POST request received");
    const response = await originalPOST(request);
    console.log("✅ UploadThing POST response:", response.status);
    return response;
  } catch (error: any) {
    console.error("❌ UploadThing POST error:", error);
    console.error("❌ Error message:", error?.message);
    console.error("❌ Error details:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { 
        error: "Upload failed",
        message: error?.message || "Unknown error",
        details: process.env.NODE_ENV === "development" ? error : undefined
      },
      { status: 500 }
    );
  }
}

export { GET, POST };

