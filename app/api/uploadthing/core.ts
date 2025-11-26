import { createUploadthing, type FileRouter } from "uploadthing/next";

// Verify environment variables are loaded
if (!process.env.UPLOADTHING_SECRET) {
  console.error("❌ UPLOADTHING_SECRET is missing!");
}
if (!process.env.UPLOADTHING_APP_ID) {
  console.error("❌ UPLOADTHING_APP_ID is missing!");
}

// Create UploadThing instance (v7)
// v7 automatically reads UPLOADTHING_SECRET and UPLOADTHING_APP_ID from environment
const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ file }) => {
      console.log("✅ Upload complete");
      console.log("📁 file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

