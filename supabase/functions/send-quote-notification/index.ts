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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quote_id } = await req.json();
    
    if (!quote_id) {
      throw new Error("quote_id is required");
    }

    console.log("Processing notification for quote:", quote_id);

    // Fetch quote details
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

    // Fetch active AND verified subscribers with notification preferences
    // Now also checking bounce count
    const { data: subscribers, error: subscribersError } = await supabase
      .from("users")
      .select("*")
      .eq("status", "active")
      .eq("notify_new_quotes", true)
      .eq("email_status", "verified")
      .lt("email_bounce_count", 3); // Skip emails that have bounced too many times

    if (subscribersError) {
      console.error("Error fetching subscribers:", subscribersError);
      throw new Error(`Failed to fetch subscribers: ${subscribersError.message}`);
    }

    console.log(`Sending notifications to ${subscribers.length} subscribers`);

    // Process in batches of 50 to avoid overwhelming the email service
    const batchSize = 50;
    const batches = [];
    for (let i = 0; i < subscribers.length; i += batchSize) {
      batches.push(subscribers.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      const emailResults = await Promise.allSettled(
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
              const error = await res.text();
              throw new Error(`Failed to send email: ${error}`);
            }

            // Record successful notification
            await supabase.from("email_notifications").insert({
              subscriber_id: subscriber.id,
              quote_id: quote_id,
              type: "quote",
              status: "sent"
            });

            return { success: true, email: subscriber.email };
          } catch (error) {
            console.error(`Failed to process subscriber ${subscriber.id}:`, error);
            
            const nextRetry = new Date();
            nextRetry.setMinutes(nextRetry.getMinutes() + 15);

            // Record failed notification with retry information
            await supabase.from("email_notifications").insert({
              subscriber_id: subscriber.id,
              quote_id: quote_id,
              type: "quote",
              status: "failed",
              error_message: error.message,
              retry_count: 0,
              next_retry_at: nextRetry.toISOString()
            });
            
            return { success: false, email: subscriber.email, error };
          }
        })
      );

      // Analyze batch results
      const batchSuccessCount = emailResults.filter(
        (result) => result.status === "fulfilled" && result.value.success
      ).length;

      console.log(`Batch processed: ${batchSuccessCount}/${batch.length} successful`);
    }

    return new Response(
      JSON.stringify({ 
        message: "Notifications processed",
        totalSubscribers: subscribers.length
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error("Error in send-quote-notification:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        code: error.code || "UNKNOWN_ERROR"
      }),
      {
        status: error.status || 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);