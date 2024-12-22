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

    // Store subscriber in database (you'll need to create this table)
    const { error: dbError } = await supabase
      .from("subscribers")
      .insert([{ name, email }]);

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to save subscription");
    }

    // Send welcome email using Resend
    const res = await fetch("https://api.resend.com/emails", {
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

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error("Failed to send welcome email");
    }

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