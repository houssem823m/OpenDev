import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import Service from "@/lib/models/Service";
import Project from "@/lib/models/Project";
import SiteContent from "@/lib/models/SiteContent";

/**
 * SEED ENDPOINT - Creates/Updates admin user and seed data
 * 
 * This endpoint can be called to seed the database or fix the admin password.
 * 
 * Usage:
 * Visit: https://opendev.onrender.com/api/seed?secret=seed-2024
 */
export async function GET(request: NextRequest) {
  try {
    console.log("🌱 [SEED] Starting seed process...");
    
    // Simple security check
    const secret = request.nextUrl.searchParams.get("secret");
    const expectedSecret = process.env.SEED_SECRET || "seed-2024";
    
    if (secret !== expectedSecret) {
      return NextResponse.json(
        { 
          error: "Unauthorized",
          message: "Add ?secret=seed-2024 to the URL",
          example: "https://opendev.onrender.com/api/seed?secret=seed-2024"
        },
        { status: 401 }
      );
    }

    await connectDB();
    console.log("✅ [SEED] Database connected");

    const results: string[] = [];

    // Create or update admin user
    const adminEmail = "admin@opendev.com";
    const adminPassword = "admin123";
    let admin = await User.findOne({ email: adminEmail });
    
    if (!admin) {
      console.log("👤 [SEED] Creating admin user...");
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      admin = await User.create({
        name: "Admin User",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        isBanned: false,
        isVerified: true,
      });
      results.push("✅ Admin user created");
      console.log("✅ [SEED] Admin user created");
    } else {
      console.log("👤 [SEED] Admin user exists, updating password and settings...");
      // Always update password to ensure it's correct
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      admin.password = hashedPassword;
      admin.role = "admin";
      admin.isBanned = false;
      admin.isVerified = true;
      await admin.save();
      
      // Verify password works
      const isValid = await bcrypt.compare(adminPassword, admin.password);
      if (isValid) {
        results.push("✅ Admin password fixed and verified");
        console.log("✅ [SEED] Admin password updated and verified");
      } else {
        results.push("⚠️ Admin updated but password verification failed");
        console.log("⚠️ [SEED] Password verification failed");
      }
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
        results.push(`✅ Service created: ${serviceData.title}`);
        console.log(`✅ [SEED] Service created: ${serviceData.title}`);
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
        results.push(`✅ Project created: ${projectData.title}`);
        console.log(`✅ [SEED] Project created: ${projectData.title}`);
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
      results.push("✅ Site content created");
      console.log("✅ [SEED] Site content created");
    }

    console.log("🎉 [SEED] Seed process completed!");

    return NextResponse.json({
      success: true,
      message: "Seed process completed successfully!",
      results,
      adminCredentials: {
        email: adminEmail,
        password: adminPassword,
        note: "You can now login with these credentials",
      },
      nextSteps: [
        "1. Try logging in at: https://opendev.onrender.com/login",
        "2. Use email: admin@opendev.com",
        "3. Use password: admin123",
      ],
    });
  } catch (error: any) {
    console.error("❌ [SEED] Seed process failed:", error);
    return NextResponse.json(
      { 
        error: "Seed process failed",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

