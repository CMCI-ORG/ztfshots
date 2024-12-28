const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SITE_URL = Deno.env.get("SITE_URL") || "http://localhost:3000";

export const sendVerificationEmail = async (
  email: string,
  name: string,
  verificationToken: string
) => {
  console.log("Sending verification email to:", email);
  
  try {
    const verificationUrl = `${SITE_URL}/verify-email?token=${verificationToken}`;
    
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Daily Dose from Z.T. Fomum <onboarding@resend.dev>",
        to: [email],
        subject: "Verify your subscription",
        html: `
          <h2>Welcome to Daily Dose from Z.T. Fomum!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for subscribing to our daily inspirational quotes. Please verify your email address by clicking the link below:</p>
          <p><a href="${verificationUrl}">Verify Email Address</a></p>
          <p>This link will expire in 24 hours.</p>
          <p>If you did not create this account, no further action is required.</p>
          <p>Best regards,<br>Daily Dose from Z.T. Fomum Team</p>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }

    console.log("Verification email sent successfully");
    return await res.json();
  } catch (error) {
    console.error("Error in sendVerificationEmail:", error);
    throw new Error("Email service error: Failed to send verification email");
  }
};