import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Checking for scheduled quotes...");

    // Get current date in UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Find scheduled quotes that should go live
    const { data: quotesToUpdate, error: fetchError } = await supabase
      .from("quotes")
      .select("*")
      .eq("status", "scheduled")
      .lte("post_date", today.toISOString());

    if (fetchError) {
      throw new Error(`Failed to fetch scheduled quotes: ${fetchError.message}`);
    }

    console.log(`Found ${quotesToUpdate?.length || 0} quotes to update`);

    if (!quotesToUpdate?.length) {
      return new Response(
        JSON.stringify({ message: "No quotes to update" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Update quotes status to live
    const { error: updateError } = await supabase
      .from("quotes")
      .update({ status: "live" })
      .in(
        "id",
        quotesToUpdate.map((q) => q.id)
      );

    if (updateError) {
      throw new Error(`Failed to update quotes: ${updateError.message}`);
    }

    // Send notifications for each quote
    const notificationPromises = quotesToUpdate.map(async (quote) => {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/functions/v1/send-quote-notification`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quote_id: quote.id }),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to send notification: ${await response.text()}`);
        }

        return { quote_id: quote.id, success: true };
      } catch (error) {
        console.error(`Failed to process quote ${quote.id}:`, error);
        return { quote_id: quote.id, success: false, error };
      }
    });

    const results = await Promise.all(notificationPromises);

    return new Response(
      JSON.stringify({
        message: "Scheduled quotes processed",
        updated: quotesToUpdate.length,
        notifications: results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing scheduled quotes:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        code: error.code || "UNKNOWN_ERROR",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});