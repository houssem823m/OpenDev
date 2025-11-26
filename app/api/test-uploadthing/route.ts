import { NextResponse } from "next/server";

export async function GET() {
  const secret = process.env.UPLOADTHING_SECRET;
  const appId = process.env.UPLOADTHING_APP_ID;

  if (!secret || !appId) {
    return NextResponse.json(
      { error: "Missing UploadThing credentials" },
      { status: 400 }
    );
  }

  // Test if we can reach UploadThing API
  try {
    const response = await fetch("https://api.uploadthing.com/v7/ping", {
      method: "GET",
      headers: {
        "x-uploadthing-api-key": secret,
        "x-uploadthing-version": "7.0.0",
      },
    });

    const data = await response.json();

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      message: data,
      credentials: {
        hasSecret: !!secret,
        hasAppId: !!appId,
        secretLength: secret.length,
        appIdLength: appId.length,
        secretPrefix: secret.substring(0, 10),
        appIdPrefix: appId.substring(0, 10),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to connect to UploadThing API",
        message: error.message,
        credentials: {
          hasSecret: !!secret,
          hasAppId: !!appId,
        },
      },
      { status: 500 }
    );
  }
}

