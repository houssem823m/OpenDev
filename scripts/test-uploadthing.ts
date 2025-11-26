import dotenv from "dotenv";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const secret = process.env.UPLOADTHING_SECRET;
const appId = process.env.UPLOADTHING_APP_ID;

console.log("🔍 Testing UploadThing API connection...\n");
console.log("📋 Configuration:");
console.log(`  Secret: ${secret ? `${secret.substring(0, 20)}... (${secret.length} chars)` : "❌ Missing"}`);
console.log(`  App ID: ${appId ? `${appId} (${appId.length} chars)` : "❌ Missing"}\n`);

if (!secret || !appId) {
  console.error("❌ Missing UploadThing credentials!");
  process.exit(1);
}

// Test prepareUpload endpoint
async function testPrepareUpload() {
  try {
    console.log("📤 Testing prepareUpload endpoint...");
    
    const response = await fetch("https://api.uploadthing.com/v7/prepareUpload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-uploadthing-api-key": secret,
        "x-uploadthing-version": "7.0.0",
      },
      body: JSON.stringify({
        files: [
          {
            name: "test.jpg",
            size: 1024,
            type: "image/jpeg",
          },
        ],
        routeConfig: {
          slug: "imageUploader",
        },
      }),
    });

    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    console.log(`\n📊 Response Status: ${response.status} ${response.statusText}`);
    console.log("📄 Response Body:");
    console.log(JSON.stringify(responseData, null, 2));

    if (response.ok) {
      console.log("\n✅ UploadThing API connection successful!");
    } else {
      console.log("\n❌ UploadThing API returned an error:");
      if (responseData?.message) {
        console.log(`   Message: ${responseData.message}`);
      }
      if (responseData?.error) {
        console.log(`   Error: ${responseData.error}`);
      }
    }

    return response.ok;
  } catch (error: any) {
    console.error("\n❌ Failed to connect to UploadThing API:");
    console.error(`   ${error.message}`);
    return false;
  }
}

// Run test
testPrepareUpload()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
  });

