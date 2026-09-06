import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(5).max(1500),
});

export const sendContactEmail = createServerFn({ method: "POST" })
  .validator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const { name, email, subject, message } = data;

    try {
      const transporter = await getTransporter();

      await transporter.sendMail({
        from: `"Atara Website" <${process.env.GMAIL_USER}>`,
        replyTo: email,
        to: "atara.wgs@gmail.com",
        subject: `[Atara Website] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#FAF9F6;border-radius:16px;">
            <div style="text-align:center;margin-bottom:20px;">
              <span style="display:inline-block;background:#04615A;color:#FAF9F6;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.2em;padding:6px 16px;border-radius:20px;">Sent via atara-website</span>
            </div>
            <h2 style="color:#04615A;font-size:20px;margin:0 0 4px;">New enquiry from the website</h2>
            <p style="color:#8c8c8c;font-size:13px;margin:0 0 20px;">${subject}</p>
            <table style="width:100%;border-collapse:collapse;font-size:14px;color:#1C1C1C;">
              <tr><td style="padding:8px 0;color:#04615A;font-weight:600;width:80px;vertical-align:top;">Name</td><td style="padding:8px 0;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#04615A;font-weight:600;vertical-align:top;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#04615A;">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#04615A;font-weight:600;vertical-align:top;">Subject</td><td style="padding:8px 0;">${subject}</td></tr>
            </table>
            <div style="margin-top:20px;padding:16px;background:#fff;border-radius:12px;border:1px solid #e0ddd5;font-size:14px;line-height:1.6;color:#1C1C1C;white-space:pre-wrap;">${message}</div>
            <p style="margin-top:20px;font-size:12px;color:#8c8c8c;border-top:1px solid #e0ddd5;padding-top:16px;">This message was sent from the contact form on the Atara website.</p>
          </div>
        `,
      });

      return { success: true };
    } catch (error: any) {
      console.error("Email error:", error);
      return { success: false, error: error.message || "Failed to send email" };
    }
  });

async function getTransporter() {
  const nodemailer = await import("nodemailer");
  return nodemailer.default.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}
