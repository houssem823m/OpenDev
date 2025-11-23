import dotenv from "dotenv";
import { resolve } from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../lib/models/User";
import Service from "../lib/models/Service";
import Project from "../lib/models/Project";
import SiteContent from "../lib/models/SiteContent";

// Load environment variables
// Try .env.local first (development), then fall back to .env (production)
dotenv.config({ path: resolve(process.cwd(), ".env.local") });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: resolve(process.cwd(), ".env") });
}

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set in .env.local");
  console.log("💡 Please set MONGODB_URI in .env.local (e.g., mongodb://localhost:27017/opendev)");
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Create admin user
    const adminExists = await User.findOne({ email: "admin@opendev.com" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = await User.create({
        name: "Admin User",
        email: "admin@opendev.com",
        password: hashedPassword,
        role: "admin",
        isBanned: false,
      });
      console.log("✅ Admin user created:", admin.email);
    } else {
      console.log("ℹ️  Admin user already exists");
    }

    // Create demo services
    const services = [
      {
        title: "Développement Web",
        description: "Création de sites web modernes et responsives avec les dernières technologies.",
        slug: "developpement-web",
        image: "",
      },
      {
        title: "Application Mobile",
        description: "Développement d'applications mobiles iOS et Android natives ou cross-platform.",
        slug: "application-mobile",
        image: "",
      },
      {
        title: "E-commerce",
        description: "Solutions e-commerce complètes avec gestion de commandes et paiements.",
        slug: "e-commerce",
        image: "",
      },
    ];

    for (const serviceData of services) {
      const exists = await Service.findOne({ slug: serviceData.slug });
      if (!exists) {
        await Service.create(serviceData);
        console.log(`✅ Service created: ${serviceData.title}`);
      }
    }

    // Create demo projects
    const projects = [
      {
        title: "Site E-commerce Premium",
        category: "E-commerce",
        description: "Plateforme e-commerce complète avec gestion de stock et paiements.",
        mainImage: "",
        externalLink: "https://example.com",
      },
      {
        title: "Application Mobile Fitness",
        category: "Mobile",
        description: "Application mobile de suivi fitness avec synchronisation cloud.",
        mainImage: "",
        externalLink: "https://example.com",
      },
    ];

    for (const projectData of projects) {
      const exists = await Project.findOne({ title: projectData.title });
      if (!exists) {
        await Project.create(projectData);
        console.log(`✅ Project created: ${projectData.title}`);
      }
    }

    // Create default site content
    const contentExists = await SiteContent.findOne({});
    if (!contentExists) {
      await SiteContent.create({
        hero: {
          title: "Bienvenue sur OpenDev",
          subtitle: "Votre partenaire de développement",
          ctaText: "Découvrir nos services",
          ctaLink: "/services",
        },
        about: {
          excerpt: "Nous sommes une équipe passionnée de développement",
          description: "OpenDev est une agence spécialisée dans le développement web et mobile.",
        },
        advantages: [
          {
            title: "Qualité",
            description: "Code de qualité et maintenable",
          },
          {
            title: "Rapidité",
            description: "Livraison rapide et efficace",
          },
          {
            title: "Support",
            description: "Support continu après livraison",
          },
        ],
        footer: {
          email: "contact@opendev.com",
          phone: "+33 1 23 45 67 89",
          hours: "Lun-Ven: 9h-18h",
        },
        siteImages: [],
      });
      console.log("✅ Site content created");
    } else {
      console.log("ℹ️  Site content already exists");
    }

    console.log("\n🎉 Seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();

