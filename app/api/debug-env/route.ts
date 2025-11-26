import { NextResponse } from "next/server";

export async function GET() {
  const secret = process.env.UPLOADTHING_SECRET;
  const appId = process.env.UPLOADTHING_APP_ID;
  
  // App ID can be with or without "app_" prefix
  const isValidAppId = appId && (appId.startsWith("app_") || appId.length >= 8);
  
  return NextResponse.json({
    hasUploadthingSecret: !!secret,
    hasUploadthingAppId: !!appId,
    secretLength: secret?.length || 0,
    appIdLength: appId?.length || 0,
    secretStartsWith: secret?.startsWith("sk_live_") || secret?.startsWith("sk_test_") ? "✅ Valid prefix" : "❌ Invalid prefix",
    appIdFormat: isValidAppId ? "✅ Valid format" : "❌ Invalid format",
    // Do NOT log actual values for security
  });
}


