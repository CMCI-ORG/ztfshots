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
    const { quote_id } = await req.json();
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

    if (quoteError) throw quoteError;

    // Fetch subscribers who want new quote notifications
    const { data: subscribers, error: subscribersError } = await supabase
      .from("subscribers")
      .select("*")
      .eq("status", "active")
      .eq("notify_new_quotes", true);

    if (subscribersError) throw subscribersError;

    console.log(`Sending notifications to ${subscribers.length} subscribers`);

    // Send emails to all subscribers
    const emailPromises = subscribers.map(async (subscriber) => {
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
          throw new Error(`Failed to send email to ${subscriber.email}`);
        }

        // Record the notification
        await supabase.from("email_notifications").insert({
          subscriber_id: subscriber.id,
          quote_id: quote_id,
          type: "new_quote",
        });

      } catch (error) {
        console.error(`Failed to process subscriber ${subscriber.id}:`, error);
      }
    });

    await Promise.all(emailPromises);

    return new Response(
      JSON.stringify({ message: "Notifications sent successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in send-quote-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);