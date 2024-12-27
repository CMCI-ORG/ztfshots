import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { weeklyDigestTemplate } from "../utils/emailTemplates.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { isTestMode = false, testEmail, selectedUsers = [] } = await req.json();
    
    console.log(`Running digest in ${isTestMode ? 'test' : 'production'} mode`);
    console.log("Selected users:", selectedUsers);
    
    if (isTestMode && !testEmail) {
      throw new Error("Test email address is required in test mode");
    }

    // Get quotes from the last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const { data: quotes, error: quotesError } = await supabase
      .from("quotes")
      .select(`
        *,
        authors:author_id(name),
        categories:category_id(name)
      `)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .eq("status", "live")
      .order("created_at", { ascending: false });

    if (quotesError) {
      console.error("Error fetching quotes:", quotesError);
      throw quotesError;
    }

    if (!quotes.length) {
      return new Response(
        JSON.stringify({ 
          message: "No quotes to send",
          recipientCount: 0 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let subscribers;
    let digest;

    // Only create digest record and fetch subscribers in production mode
    if (!isTestMode) {
      // Create digest record
      const { data: digestData, error: digestError } = await supabase
        .from("weekly_digests")
        .insert({
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          recipient_count: 0,
        })
        .select()
        .single();

      if (digestError) {
        console.error("Error creating digest:", digestError);
        throw digestError;
      }
      
      digest = digestData;

      // Fetch subscribers based on selection or all active subscribers
      const query = supabase
        .from("users")
        .select("*")
        .eq("status", "active")
        .eq("notify_weekly_digest", true)
        .eq("email_status", "verified")
        .lt("email_bounce_count", 3);

      if (selectedUsers.length > 0) {
        query.in("id", selectedUsers);
      }

      const { data: subscribersData, error: subscribersError } = await query;

      if (subscribersError) {
        console.error("Error fetching subscribers:", subscribersError);
        throw subscribersError;
      }

      subscribers = subscribersData;
      console.log(`Found ${subscribers.length} subscribers for weekly digest`);
    }

    // In test mode, we only send to the test email
    const recipientsList = isTestMode 
      ? [{ email: testEmail, name: "Test User" }]
      : subscribers;

    if (!recipientsList?.length) {
      return new Response(
        JSON.stringify({ 
          message: "No eligible recipients found",
          recipientCount: 0 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Sending digest to ${recipientsList.length} recipient(s)`);

    let successCount = 0;
    let failureCount = 0;

    // Send emails in batches of 50
    const batchSize = 50;
    for (let i = 0; i < recipientsList.length; i += batchSize) {
      const batch = recipientsList.slice(i, i + batchSize);
      
      const emailPromises = batch.map(async (subscriber) => {
        try {
          console.log(`Sending digest to ${subscriber.email}`);
          
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: "ZTF Books <onboarding@resend.dev>",
              to: [subscriber.email],
              subject: isTestMode ? "[TEST] Your Weekly Quote Digest - ZTF Books" : "Your Weekly Quote Digest - ZTF Books",
              html: weeklyDigestTemplate(quotes),
            }),
          });

          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to send email to ${subscriber.email}: ${errorText}`);
          }

          // Only record notifications in production mode
          if (!isTestMode) {
            await supabase.from("email_notifications").insert({
              subscriber_id: subscriber.id,
              digest_id: digest.id,
              type: "weekly_digest",
              status: "sent"
            });
          }

          successCount++;

        } catch (error) {
          console.error(`Failed to process subscriber ${subscriber.email}:`, error);
          failureCount++;
          
          if (!isTestMode) {
            await supabase.from("email_notifications").insert({
              subscriber_id: subscriber.id,
              digest_id: digest.id,
              type: "weekly_digest",
              status: "failed",
              error_message: error.message
            });
          }
        }
      });

      await Promise.allSettled(emailPromises);
      console.log(`Processed batch ${i/batchSize + 1}`);
    }

    // Update digest with final recipient count in production mode
    if (!isTestMode && digest) {
      await supabase
        .from("weekly_digests")
        .update({ recipient_count: successCount })
        .eq("id", digest.id);
    }

    return new Response(
      JSON.stringify({ 
        message: `Weekly digest ${isTestMode ? 'test ' : ''}completed`,
        recipientCount: successCount,
        failureCount,
        testMode: isTestMode
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in send-weekly-digest:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        testMode: error?.testMode || false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);