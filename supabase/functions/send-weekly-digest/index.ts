import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { sendEmail, recordEmailNotification, updateUserEmailStatus } from "./utils/emailService.ts";
import { fetchQuotes, createDigestRecord, updateDigestRecipientCount } from "./utils/digestService.ts";
import { supabase } from "./utils/emailService.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
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

    const quotes = await fetchQuotes(startDate, endDate);

    if (!quotes.length) {
      return new Response(
        JSON.stringify({ message: "No quotes to send", recipientCount: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let digest;
    let subscribers;

    // Only create digest record and fetch subscribers in production mode
    if (!isTestMode) {
      digest = await createDigestRecord(startDate, endDate);

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
      if (subscribersError) throw subscribersError;
      subscribers = subscribersData;
    }

    // In test mode, we only send to the test email
    const recipientsList = isTestMode 
      ? [{ email: testEmail, name: "Test User" }]
      : subscribers;

    if (!recipientsList?.length) {
      return new Response(
        JSON.stringify({ message: "No eligible recipients found", recipientCount: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
          
          const result = await sendEmail(subscriber, quotes, isTestMode);

          if (!result.success) {
            throw result.error;
          }

          if (!isTestMode) {
            await recordEmailNotification(subscriber.id, digest.id, "sent");
            await updateUserEmailStatus(subscriber.id, "verified");
          }

          successCount++;
        } catch (error) {
          console.error(`Failed to process subscriber ${subscriber.email}:`, error);
          failureCount++;
          
          if (!isTestMode) {
            await recordEmailNotification(
              subscriber.id,
              digest.id,
              "failed",
              error.message
            );
          }
        }
      });

      await Promise.allSettled(emailPromises);
      console.log(`Processed batch ${i/batchSize + 1}`);
    }

    // Update digest with final recipient count in production mode
    if (!isTestMode && digest) {
      await updateDigestRecipientCount(digest.id, successCount);
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
});