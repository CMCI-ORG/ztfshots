import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendDigestEmail, recordEmailNotification, updateUserEmailStatus } from "./utils/digestService.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
    const errors: any[] = [];

    // Process users in batches of 10 to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      
      const results = await Promise.allSettled(
        batch.map(async (user) => {
          try {
            console.log(`Processing digest for ${user.email}`);
            
            await sendDigestEmail(user, quotes, isTestMode);
            
            // Record successful notification
            await recordEmailNotification(digest.id, user.id, "sent");
            
            // Update user email status to verified after successful send
            await updateUserEmailStatus(user.id);
            
            successCount++;
            console.log(`Successfully processed digest for ${user.email}`);
            return { success: true, email: user.email };
          } catch (error) {
            console.error(`Failed to process digest for ${user.email}:`, error);
            failureCount++;
            
            // Record failed notification
            await recordEmailNotification(
              digest.id, 
              user.id, 
              "failed",
              error.message
            );
            
            errors.push({ email: user.email, error: error.message });
            return { success: false, email: user.email, error };
          }
        })
      );

      console.log(`Batch processed: ${successCount} successful, ${failureCount} failed`);
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
        errors,
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