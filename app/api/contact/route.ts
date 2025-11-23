import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import SiteContent from "@/lib/models/SiteContent";
import { sendOrderNotificationEmail } from "@/lib/utils/email";

const contactSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  subject: z.string().min(1, "Le sujet est requis"),
  message: z.string().min(1, "Le message est requis"),
});

// POST /api/contact - Send a contact message
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Validate input
    const validatedData = contactSchema.parse(body);

    // Get site content for admin email
    const siteContent = await SiteContent.findOne({});
    const adminEmail = siteContent?.footer?.email || process.env.ADMIN_EMAIL || "admin@opendev.com";

    // Send email notification if enabled
    try {
      if (process.env.SENDGRID_API_KEY) {
        await sendOrderNotificationEmail(adminEmail, {
          orderId: `contact-${Date.now()}`,
          serviceName: validatedData.subject,
          customerName: validatedData.name,
          customerEmail: validatedData.email,
          message: validatedData.message,
        });
      } else {
        console.log("Contact message received (SENDGRID_API_KEY not set):", validatedData);
      }
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
      // Don't fail contact submission if email fails
    }

    return NextResponse.json({
      success: true,
      data: null,
      message: "Message envoyé avec succès! Nous vous répondrons dans les plus brefs délais.",
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Erreur de validation",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error.message || "Erreur lors de l'envoi du message",
      },
      { status: 500 }
    );
  }
}

