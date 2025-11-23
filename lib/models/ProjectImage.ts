import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface IProjectImage extends Document {
  projectId: Types.ObjectId;
  imageUrl: string;
}

const ProjectImageSchema = new Schema<IProjectImage>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
  },
  {
    timestamps: false,
  }
);

const ProjectImage: Model<IProjectImage> =
  mongoose.models.ProjectImage ||
  mongoose.model<IProjectImage>("ProjectImage", ProjectImageSchema);

export default ProjectImage;

