import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { newQuoteEmailTemplate } from "../utils/emailTemplates.ts";

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
    // Validate request
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { quote_id } = await req.json();
    
    if (!quote_id) {
      throw new Error("quote_id is required");
    }

    console.log("Processing notification for quote:", quote_id);

    // Fetch quote details with error handling
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
      throw new Error("Quote not found");
    }

    // Fetch active users with notification preferences
    const { data: subscribers, error: subscribersError } = await supabase
      .from("users")  // Changed from "subscribers" to "users"
      .select("*")
      .eq("status", "active")
      .eq("notify_new_quotes", true);

    if (subscribersError) {
      console.error("Error fetching subscribers:", subscribersError);
      throw new Error(`Failed to fetch subscribers: ${subscribersError.message}`);
    }

    if (!subscribers.length) {
      console.log("No active subscribers found");
      return new Response(
        JSON.stringify({ 
          message: "No active subscribers to notify",
          recipientCount: 0
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Sending notifications to ${subscribers.length} subscribers`);

    // Send emails to all subscribers with proper error handling
    const emailResults = await Promise.allSettled(
      subscribers.map(async (subscriber) => {
        try {
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
              html: newQuoteEmailTemplate(quote),
            }),
          });

          if (!res.ok) {
            const error = await res.text();
            throw new Error(`Failed to send email to ${subscriber.email}: ${error}`);
          }

          // Record the notification
          await supabase.from("email_notifications").insert({
            subscriber_id: subscriber.id,
            quote_id: quote_id,
            type: "quote",
            status: "sent"
          });

          return { success: true, email: subscriber.email };
        } catch (error) {
          console.error(`Failed to process subscriber ${subscriber.id}:`, error);
          
          // Record failed notification
          await supabase.from("email_notifications").insert({
            subscriber_id: subscriber.id,
            quote_id: quote_id,
            type: "quote",
            status: "failed"
          });
          
          return { success: false, email: subscriber.email, error };
        }
      })
    );

    // Analyze results
    const successCount = emailResults.filter(
      (result) => result.status === "fulfilled" && result.value.success
    ).length;

    const failureCount = subscribers.length - successCount;

    console.log(`Successfully sent ${successCount} emails, ${failureCount} failed`);

    return new Response(
      JSON.stringify({ 
        message: "Notifications processed",
        recipientCount: successCount,
        failureCount,
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