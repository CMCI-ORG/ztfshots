import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { weeklyDigestTemplate } from "../../../utils/emailTemplates.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function sendDigestEmail(user: any, quotes: any[], isTestMode: boolean) {
  console.log(`Attempting to send digest to ${user.email}`);
  
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ZTF Books <onboarding@resend.dev>",
        to: [user.email],
        subject: isTestMode ? "[TEST] Your Weekly Quote Digest" : "Your Weekly Quote Digest",
        html: weeklyDigestTemplate(quotes),
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Failed to send email to ${user.email}:`, errorText);
      throw new Error(errorText);
    }

    const data = await res.json();
    console.log(`Successfully sent digest to ${user.email}:`, data);
    return data;
  } catch (error) {
    console.error(`Error sending digest to ${user.email}:`, error);
    throw error;
  }
}

export async function recordEmailNotification(digestId: string, userId: string, status: string, errorMessage?: string) {
  try {
    const { error } = await supabase.from("email_notifications").insert({
      subscriber_id: userId,
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

export async function updateUserEmailStatus(userId: string) {
  try {
    const { error } = await supabase
      .from("users")
      .update({ email_status: "verified" })
      .eq("id", userId);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
}