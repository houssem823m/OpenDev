import AdminAction from "@/lib/models/AdminAction";
import { Types } from "mongoose";

export async function logAdminAction(
  adminId: string,
  action: string,
  targetType: "user" | "service" | "project" | "order" | "content",
  targetId?: string,
  details?: Record<string, any>
) {
  try {
    await AdminAction.create({
      adminId: new Types.ObjectId(adminId),
      action,
      targetType,
      targetId,
      details: details || {},
    });
  } catch (error) {
    // Fail silently - don't break the main operation
    console.error("Failed to log admin action:", error);
  }
}

