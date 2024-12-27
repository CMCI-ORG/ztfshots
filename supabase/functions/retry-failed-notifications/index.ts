import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const calculateNextRetryTime = (retryCount: number): Date => {
  // Exponential backoff: 5min, 15min, 45min, 2h, 6h
  const delayMinutes = Math.min(5 * Math.pow(3, retryCount), 360);
  const nextRetry = new Date();
  nextRetry.setMinutes(nextRetry.getMinutes() + delayMinutes);
  return nextRetry;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get failed notifications that are due for retry
    const { data: failedNotifications, error: fetchError } = await supabase
      .from("email_notifications")
      .select("*")
      .eq("status", "failed")
      .lte("next_retry_at", new Date().toISOString())
      .lt("retry_count", 5); // Max 5 retry attempts

    if (fetchError) throw fetchError;

    if (!failedNotifications?.length) {
      return new Response(
        JSON.stringify({ message: "No notifications to retry" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    console.log(`Processing ${failedNotifications.length} failed notifications`);

    const results = await Promise.all(
      failedNotifications.map(async (notification) => {
        try {
          // Attempt to resend the email
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: "ZTF Books <onboarding@resend.dev>",
              to: [notification.subscriber_id], // You'll need to fetch the actual email
              subject: "New Quote Added - ZTF Books",
              html: "Retry notification", // You'll need to recreate the proper email content
            }),
          });

          if (!res.ok) {
            throw new Error(await res.text());
          }

          // Update notification status to sent
          await supabase
            .from("email_notifications")
            .update({ status: "sent" })
            .eq("id", notification.id);

          return { id: notification.id, success: true };
        } catch (error) {
          console.error(`Failed to retry notification ${notification.id}:`, error);

          const nextRetry = calculateNextRetryTime(notification.retry_count + 1);

          // Update retry count and next retry time
          await supabase
            .from("email_notifications")
            .update({ 
              retry_count: notification.retry_count + 1,
              next_retry_at: nextRetry.toISOString(),
              error_message: error.message
            })
            .eq("id", notification.id);

          return { id: notification.id, success: false, error: error.message };
        }
      })
    );

    return new Response(
      JSON.stringify({
        message: "Retry process completed",
        results
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error in retry-failed-notifications:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});