import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { newQuoteEmailTemplate } from "./utils/emailTemplates.ts";

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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quote_id } = await req.json();
    
    if (!quote_id) {
      console.error("Missing quote_id in request");
      throw new Error("quote_id is required");
    }

    console.log("Processing notification for quote:", quote_id);

    // Fetch quote details with validation
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select(`
        *,
        authors:author_id(name),
        categories:category_id(name)
      `)
      .eq("id", quote_id)
      .single();

    if (quoteError) {
      console.error("Error fetching quote:", quoteError);
      throw new Error(`Failed to fetch quote: ${quoteError.message}`);
    }

    if (!quote) {
      console.error("Quote not found:", quote_id);
      throw new Error("Quote not found");
    }

    // Fetch active AND verified subscribers with notification preferences
    const { data: subscribers, error: subscribersError } = await supabase
      .from("users")
      .select("*")
      .eq("status", "active")
      .eq("notify_new_quotes", true)
      .eq("email_status", "verified")
      .lt("email_bounce_count", 3);

    if (subscribersError) {
      console.error("Error fetching subscribers:", subscribersError);
      throw new Error(`Failed to fetch subscribers: ${subscribersError.message}`);
    }

    if (!subscribers?.length) {
      console.log("No active subscribers found");
      return new Response(
        JSON.stringify({ message: "No active subscribers" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    console.log(`Sending notifications to ${subscribers.length} subscribers`);

    // Process in batches of 50 to avoid overwhelming the email service
    const batchSize = 50;
    const batches = [];
    for (let i = 0; i < subscribers.length; i += batchSize) {
      batches.push(subscribers.slice(i, i + batchSize));
    }

    const results = [];
    for (const batch of batches) {
      console.log(`Processing batch of ${batch.length} subscribers`);
      
      const batchResults = await Promise.allSettled(
        batch.map(async (subscriber) => {
          try {
            const unsubscribeUrl = `${SUPABASE_URL}/unsubscribe?token=${subscriber.unsubscribe_token}`;
            
            const res = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
              },
              body: JSON.stringify({
                from: "ZTF Books <onboarding@resend.dev>",
                to: [subscriber.email],
                subject: "New Quote Added - ZTF Books",
                html: newQuoteEmailTemplate(quote, unsubscribeUrl),
              }),
            });

            if (!res.ok) {
              const errorText = await res.text();
              console.error(`Failed to send email to ${subscriber.email}:`, errorText);
              throw new Error(`Failed to send email: ${errorText}`);
            }

            // Record successful notification
            const { error: notificationError } = await supabase
              .from("email_notifications")
              .insert({
                subscriber_id: subscriber.id,
                quote_id: quote_id,
                type: "quote",
                status: "sent"
              });

            if (notificationError) {
              console.error(`Failed to record notification for ${subscriber.email}:`, notificationError);
            }

            return { success: true, email: subscriber.email };
          } catch (error) {
            const typedError = error as NotificationError;
            console.error(`Failed to process subscriber ${subscriber.id}:`, {
              error: typedError.message,
              code: typedError.code,
              details: typedError.details
            });
            
            const nextRetry = new Date();
            nextRetry.setMinutes(nextRetry.getMinutes() + 15);

            // Record failed notification with retry information
            const { error: notificationError } = await supabase
              .from("email_notifications")
              .insert({
                subscriber_id: subscriber.id,
                quote_id: quote_id,
                type: "quote",
                status: "failed",
                error_message: typedError.message,
                retry_count: 0,
                next_retry_at: nextRetry.toISOString()
              });

            if (notificationError) {
              console.error(`Failed to record failed notification for ${subscriber.email}:`, notificationError);
            }
            
            return { success: false, email: subscriber.email, error: typedError.message };
          }
        })
      );

      results.push(...batchResults);
    }

    const successCount = results.filter(
      (result) => result.status === "fulfilled" && result.value.success
    ).length;

    console.log(`Notification process completed. ${successCount}/${results.length} successful`);

    return new Response(
      JSON.stringify({ 
        message: "Notifications processed",
        totalSubscribers: subscribers.length,
        successCount,
        totalProcessed: results.length
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    const typedError = error as NotificationError;
    console.error("Error in send-quote-notification:", {
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
        status: error.status || 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);