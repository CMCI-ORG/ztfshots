import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function sendEmail(recipient: { email: string, name: string }, quotes: any[], isTestMode: boolean) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ZTF Books <onboarding@resend.dev>",
        to: [recipient.email],
        subject: isTestMode ? "[TEST] Your Weekly Quote Digest - ZTF Books" : "Your Weekly Quote Digest - ZTF Books",
        html: weeklyDigestTemplate(quotes),
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to send email to ${recipient.email}: ${errorText}`);
    }

    return { success: true };
  } catch (error) {
    console.error(`Email sending failed for ${recipient.email}:`, error);
    return { success: false, error };
  }
}

export async function recordEmailNotification(subscriberId: string, digestId: string, status: string, errorMessage?: string) {
  try {
    const { error } = await supabase.from("email_notifications").insert({
      subscriber_id: subscriberId,
      digest_id: digestId,
      type: "weekly_digest",
      status: status,
      error_message: errorMessage
    });

    if (error) throw error;
  } catch (error) {
    console.error("Error recording notification:", error);
    throw error;
  }
}

export async function updateUserEmailStatus(userId: string, status: string) {
  try {
    const { error } = await supabase
      .from("users")
      .update({ email_status: status })
      .eq("id", userId);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
}

function weeklyDigestTemplate(quotes: any[]) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .quote { padding: 20px; background: #f9f9f9; border-left: 4px solid #8B5CF6; margin: 20px 0; }
      .footer { margin-top: 30px; font-size: 12px; color: #666; }
      .cta-button { 
        display: inline-block; 
        padding: 10px 20px; 
        background-color: #8B5CF6; 
        color: white !important; 
        text-decoration: none; 
        border-radius: 5px; 
        margin-top: 15px; 
      }
      .source-link {
        color: #8B5CF6;
        text-decoration: none;
        margin-top: 10px;
        display: inline-block;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Your Weekly Quote Digest</h2>
      ${quotes.map(quote => `
        <div class="quote">
          <p>${quote.text}</p>
          <p><strong>- ${quote.authors.name}</strong></p>
          <p>Category: ${quote.categories.name}</p>
        </div>
      `).join('')}
      <div class="footer">
        <p>You're receiving this because you subscribed to weekly digest notifications.</p>
        <p>To update your preferences, please <a href="https://quotes.ztfomum.org/profile" style="color: #8B5CF6; text-decoration: underline;">visit your profile settings</a>.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}
