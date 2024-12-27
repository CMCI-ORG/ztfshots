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

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { isTestMode = false, selectedUsers = [] } = await req.json();
    console.log(`Running digest in ${isTestMode ? 'test' : 'production'} mode`);
    console.log("Selected users:", selectedUsers);

    if (selectedUsers.length === 0) {
      throw new Error("No users selected");
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
          message: "No quotes available for digest", 
          recipientCount: 0 
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get user details for selected users
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .in("id", selectedUsers)
      .eq("status", "active");

    if (usersError) {
      console.error("Error fetching users:", usersError);
      throw usersError;
    }

    if (!users.length) {
      return new Response(
        JSON.stringify({ 
          message: "No active users found among selected users", 
          recipientCount: 0 
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log(`Processing ${users.length} users`);

    // Create digest record
    const { data: digest, error: digestError } = await supabase
      .from("weekly_digests")
      .insert({
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        recipient_count: users.length
      })
      .select()
      .single();

    if (digestError) {
      console.error("Error creating digest record:", digestError);
      throw digestError;
    }

    let successCount = 0;
    let failureCount = 0;

    // Process users in batches of 50
    const batchSize = 50;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (user) => {
        try {
          console.log(`Sending digest to ${user.email}`);
          
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
            throw new Error(await res.text());
          }

          // Record successful notification
          await supabase.from("email_notifications").insert({
            subscriber_id: user.id,
            digest_id: digest.id,
            type: "weekly_digest",
            status: "sent"
          });

          // Update user email status to verified if it was pending
          if (user.email_status === 'pending') {
            await supabase
              .from("users")
              .update({ email_status: "verified" })
              .eq("id", user.id);
          }

          successCount++;
          console.log(`Successfully sent digest to ${user.email}`);
        } catch (error) {
          console.error(`Failed to send digest to ${user.email}:`, error);
          failureCount++;
          
          // Record failed notification
          await supabase.from("email_notifications").insert({
            subscriber_id: user.id,
            digest_id: digest.id,
            type: "weekly_digest",
            status: "failed",
            error_message: error.message
          });
        }
      }));
    }

    // Update digest with final counts
    await supabase
      .from("weekly_digests")
      .update({ recipient_count: successCount })
      .eq("id", digest.id);

    return new Response(
      JSON.stringify({
        message: `Weekly digest completed`,
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

function weeklyDigestTemplate(quotes: any[]) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .quote { padding: 20px; background: #f9f9f9; border-left: 4px solid #8B5CF6; margin: 20px 0; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Your Weekly Quote Digest</h2>
        ${quotes.map(quote => `
          <div class="quote">
            <p>${quote.text}</p>
            <p><strong>- ${quote.authors.name}</strong></p>
            <p>Category: ${quote.categories.name}</p>
          </div>
        `).join('')}
        <div class="footer">
          <p>You're receiving this because you subscribed to weekly digest notifications.</p>
          <p>To update your preferences, please visit your profile settings.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}