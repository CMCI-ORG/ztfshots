import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SubscriptionRequest {
  name: string;
  email: string;
}

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

const handler = async (req: Request): Promise<Response> => {
  console.log("Subscription request received");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email }: SubscriptionRequest = await req.json();
    console.log(`Processing subscription for ${name} (${email})`);

    if (!name || !email) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from("subscribers")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (existingSubscriber) {
      console.log("Email already subscribed:", email);
      return new Response(
        JSON.stringify({ error: "Email already subscribed" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Store subscriber in database
    const { error: dbError } = await supabase
      .from("subscribers")
      .insert([{ name, email }]);

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save subscription" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send welcome email using Resend
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "Email service configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ZTF Books <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to ZTF Books Daily Inspiration!",
        html: `
          <h1>Welcome to ZTF Books Daily Inspiration, ${name}!</h1>
          <p>Thank you for subscribing to our daily inspiration emails.</p>
          <p>You'll start receiving daily quotes that will inspire and motivate you on your journey.</p>
          <p>Best regards,<br>ZTF Books Team</p>
        `,
      }),
    });

    if (!emailRes.ok) {
      const error = await emailRes.text();
      console.error("Resend API error:", error);
      // Still return success even if email fails, as the subscription was saved
      return new Response(
        JSON.stringify({ 
          message: "Subscription successful, but welcome email failed to send",
          emailError: error 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Subscription and welcome email sent successfully");
    return new Response(
      JSON.stringify({ message: "Subscription successful" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in subscribe function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Subscription failed" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);