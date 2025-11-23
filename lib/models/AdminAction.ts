import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface IAdminAction extends Document {
  adminId: Types.ObjectId;
  action: string;
  targetType: "user" | "service" | "project" | "order" | "content";
  targetId?: string;
  details: Record<string, any>;
  createdAt: Date;
}

const AdminActionSchema = new Schema<IAdminAction>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      enum: ["user", "service", "project", "order", "content"],
      required: true,
    },
    targetId: {
      type: String,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

AdminActionSchema.index({ adminId: 1, createdAt: -1 });
AdminActionSchema.index({ targetType: 1, targetId: 1 });

const AdminAction: Model<IAdminAction> =
  mongoose.models.AdminAction ||
  mongoose.model<IAdminAction>("AdminAction", AdminActionSchema);

export default AdminAction;

