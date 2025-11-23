import mongoose, { Schema, Model, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  category: string;
  description?: string;
  mainImage?: string;
  externalLink?: string;
  isArchived: boolean;
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    description: {
      type: String,
    },
    mainImage: {
      type: String,
    },
    externalLink: {
      type: String,
    },
    isArchived: {
      type: Boolean,
      default: false,
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

const Project: Model<IProject> =
  mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);

export default Project;

