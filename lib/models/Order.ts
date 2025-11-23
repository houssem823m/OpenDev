import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface IOrder extends Document {
  serviceId: Types.ObjectId;
  name: string;
  email: string;
  message: string;
  fileUrl?: string;
  status: "pending" | "in_progress" | "done" | "cancelled";
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service ID is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    fileUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "done", "cancelled"],
      default: "pending",
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

// Add indexes for performance
OrderSchema.index({ status: 1 });
OrderSchema.index({ serviceId: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ name: "text", email: "text", message: "text" });

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;

