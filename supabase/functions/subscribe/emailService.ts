import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function sendVerificationEmail(email: string, name: string, token: string, RESEND_API_KEY: string, siteUrl: string) {
  if (!RESEND_API_KEY) {
    throw new Error("Email service configuration is missing");
  }

  const verificationUrl = `${siteUrl}/verify-email?token=${token}`;
  
  const emailRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "ZTF Books <onboarding@resend.dev>",
      to: [email],
      subject: "Verify your email - ZTF Books",
      html: `
        <h1>Welcome to ZTF Books, ${name}!</h1>
        <p>Please verify your email address by clicking the link below:</p>
        <p><a href="${verificationUrl}">Verify Email Address</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
        <p>Best regards,<br>ZTF Books Team</p>
      `,
    }),
  });

  if (!emailRes.ok) {
    const error = await emailRes.text();
    console.error("Resend API error:", error);
    throw new Error("Failed to send verification email. Our email service is temporarily unavailable.");
  }

  return emailRes;
}