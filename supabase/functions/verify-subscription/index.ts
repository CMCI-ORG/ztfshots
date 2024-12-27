import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token } = await req.json();

    if (!token) {
      throw new Error("Verification token is required");
    }

    // Get verification record
    const { data: verification, error: verificationError } = await supabase
      .from("email_verifications")
      .select("*")
      .eq("token", token)
      .single();

    if (verificationError || !verification) {
      throw new Error("Invalid verification token");
    }

    if (verification.verified_at) {
      throw new Error("Email already verified");
    }

    if (new Date(verification.expires_at) < new Date()) {
      throw new Error("Verification token has expired");
    }

    // Begin transaction
    const { data: user, error: userError } = await supabase
      .from("users")
      .update({
        email_verified_at: new Date().toISOString(),
        email_status: "verified"
      })
      .eq("email", verification.email)
      .select()
      .single();

    if (userError) {
      throw new Error("Failed to verify user email");
    }

    // Update verification record
    await supabase
      .from("email_verifications")
      .update({
        verified_at: new Date().toISOString()
      })
      .eq("token", token);

    // Send welcome email
    const welcomeEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ZTF Books <onboarding@resend.dev>",
        to: [verification.email],
        subject: "Welcome to ZTF Books!",
        html: `
          <h1>Welcome to ZTF Books!</h1>
          <p>Thank you for verifying your email. You'll now start receiving our inspirational quotes.</p>
          <p>Best regards,<br>ZTF Books Team</p>
        `,
      }),
    });

    if (!welcomeEmailRes.ok) {
      console.error("Failed to send welcome email:", await welcomeEmailRes.text());
    } else {
      await supabase
        .from("users")
        .update({ welcome_email_sent: true })
        .eq("email", verification.email);
    }

    return new Response(
      JSON.stringify({ message: "Email verified successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in verify-subscription function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});