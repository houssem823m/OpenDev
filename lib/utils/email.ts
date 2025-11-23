import sgMail from "@sendgrid/mail";

interface OrderEmailData {
  orderId: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  message: string;
  fileUrl?: string;
}

export async function sendOrderNotificationEmail(
  adminEmail: string,
  orderData: OrderEmailData
): Promise<{ success: boolean; error?: string }> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log("SENDGRID_API_KEY not set, logging email instead:", orderData);
    return { success: true };
  }

  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const adminHtml = `
      <h2>Nouvelle commande reçue</h2>
      <p><strong>ID:</strong> ${orderData.orderId}</p>
      <p><strong>Service:</strong> ${orderData.serviceName}</p>
      <p><strong>Client:</strong> ${orderData.customerName} (${orderData.customerEmail})</p>
      <p><strong>Message:</strong></p>
      <p>${orderData.message}</p>
      ${orderData.fileUrl ? `<p><a href="${orderData.fileUrl}">Voir le fichier</a></p>` : ""}
      <p><a href="${process.env.NEXTAUTH_URL}/admin/orders">Voir dans l'admin</a></p>
    `;

    await sgMail.send({
      to: adminEmail,
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@opendev.com",
      subject: `Nouvelle commande: ${orderData.serviceName}`,
      html: adminHtml,
    });

    const customerHtml = `
      <h2>Merci pour votre commande!</h2>
      <p>Bonjour ${orderData.customerName},</p>
      <p>Nous avons bien reçu votre demande pour le service <strong>${orderData.serviceName}</strong>.</p>
      <p>Notre équipe va examiner votre demande et vous contactera sous peu.</p>
      <p>Cordialement,<br>L'équipe OpenDev</p>
    `;

    await sgMail.send({
      to: orderData.customerEmail,
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@opendev.com",
      subject: "Confirmation de votre commande",
      html: customerHtml,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
}

