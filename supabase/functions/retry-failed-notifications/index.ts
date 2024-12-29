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

interface NotificationError extends Error {
  code?: string;
  details?: string;
}

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
    console.log("Starting retry-failed-notifications process");

    // Get failed notifications that are due for retry
    const { data: failedNotifications, error: fetchError } = await supabase
      .from("email_notifications")
      .select("*")
      .eq("status", "failed")
      .lte("next_retry_at", new Date().toISOString())
      .lt("retry_count", 5); // Max 5 retry attempts

    if (fetchError) {
      console.error("Error fetching failed notifications:", fetchError);
      throw fetchError;
    }

    if (!failedNotifications?.length) {
      console.log("No notifications to retry");
      return new Response(
        JSON.stringify({ message: "No notifications to retry" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    console.log(`Processing ${failedNotifications.length} failed notifications`);

    // Process in batches of 10 to avoid rate limits
    const batchSize = 10;
    const batches = [];
    for (let i = 0; i < failedNotifications.length; i += batchSize) {
      batches.push(failedNotifications.slice(i, i + batchSize));
    }

    const results = [];
    for (const batch of batches) {
      const batchResults = await Promise.allSettled(
        batch.map(async (notification) => {
          try {
            console.log(`Retrying notification ${notification.id}`);

            // Attempt to resend the email
            const res = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
              },
              body: JSON.stringify({
                from: "ZTF Books <onboarding@resend.dev>",
                to: [notification.subscriber_id],
                subject: "New Quote Added - ZTF Books",
                html: "Retry notification", // You'll need to recreate the proper email content
              }),
            });

            if (!res.ok) {
              const errorText = await res.text();
              console.error(`Resend API error for ${notification.id}:`, errorText);
              throw new Error(errorText);
            }

            // Update notification status to sent
            const { error: updateError } = await supabase
              .from("email_notifications")
              .update({ status: "sent" })
              .eq("id", notification.id);

            if (updateError) {
              console.error(`Error updating notification ${notification.id}:`, updateError);
              throw updateError;
            }

            console.log(`Successfully retried notification ${notification.id}`);
            return { id: notification.id, success: true };
          } catch (error) {
            const typedError = error as NotificationError;
            console.error(`Failed to retry notification ${notification.id}:`, {
              error: typedError.message,
              code: typedError.code,
              details: typedError.details
            });

            const nextRetry = calculateNextRetryTime(notification.retry_count + 1);

            // Update retry count and next retry time
            const { error: updateError } = await supabase
              .from("email_notifications")
              .update({ 
                retry_count: notification.retry_count + 1,
                next_retry_at: nextRetry.toISOString(),
                error_message: typedError.message
              })
              .eq("id", notification.id);

            if (updateError) {
              console.error(`Error updating retry info for ${notification.id}:`, updateError);
            }

            return { 
              id: notification.id, 
              success: false, 
              error: typedError.message,
              code: typedError.code
            };
          }
        })
      );

      results.push(...batchResults);
    }

    const successCount = results.filter(
      (result) => result.status === "fulfilled" && result.value.success
    ).length;

    console.log(`Retry process completed. ${successCount}/${results.length} successful`);

    return new Response(
      JSON.stringify({
        message: "Retry process completed",
        results,
        successCount,
        totalProcessed: results.length
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    const typedError = error as NotificationError;
    console.error("Error in retry-failed-notifications:", {
      message: typedError.message,
      code: typedError.code,
      details: typedError.details,
      stack: typedError.stack
    });
    
    return new Response(
      JSON.stringify({ 
        error: typedError.message,
        code: typedError.code || "UNKNOWN_ERROR",
        details: typedError.details
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});