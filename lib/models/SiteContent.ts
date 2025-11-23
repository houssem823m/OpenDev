import mongoose, { Schema, Model, Document } from "mongoose";

export interface ISiteContent extends Document {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    image?: string;
  };
  about: {
    excerpt: string;
    description: string;
  };
  advantages: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
  footer: {
    email: string;
    phone: string;
    hours: string;
  };
  siteImages: string[];
  updatedAt: Date;
}

const SiteContentSchema = new Schema<ISiteContent>(
  {
    hero: {
      title: { type: String, default: "Bienvenue sur OpenDev" },
      subtitle: { type: String, default: "Votre partenaire de développement" },
      ctaText: { type: String, default: "Découvrir nos services" },
      ctaLink: { type: String, default: "/services" },
      image: { type: String },
    },
    about: {
      excerpt: { type: String, default: "Nous sommes une équipe passionnée..." },
      description: { type: String, default: "" },
    },
    advantages: [
      {
        icon: { type: String },
        title: { type: String },
        description: { type: String },
      },
    ],
    footer: {
      email: { type: String, default: "contact@opendev.com" },
      phone: { type: String, default: "+33 1 23 45 67 89" },
      hours: { type: String, default: "Lun-Ven: 9h-18h" },
    },
    siteImages: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const SiteContent: Model<ISiteContent> =
  mongoose.models.SiteContent ||
  mongoose.model<ISiteContent>("SiteContent", SiteContentSchema);

export default SiteContent;

