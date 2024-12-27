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

interface SubscriptionRequest {
  name: string;
  email: string;
  notify_new_quotes?: boolean;
  notify_weekly_digest?: boolean;
  notify_whatsapp?: boolean;
  whatsapp_phone?: string;
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const handler = async (req: Request): Promise<Response> => {
  console.log("Subscription request received");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      name, 
      email,
      notify_new_quotes = true,
      notify_weekly_digest = true,
      notify_whatsapp = false,
      whatsapp_phone = null
    }: SubscriptionRequest = await req.json();
    
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
      .from("users")
      .select("email, email_status")
      .eq("email", email)
      .maybeSingle();

    if (existingSubscriber) {
      if (existingSubscriber.email_status === 'pending') {
        // Resend verification email
        return await sendVerificationEmail(email, name);
      }
      
      console.log("Email already subscribed:", email);
      return new Response(
        JSON.stringify({ error: "Email already subscribed" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiration

    // Create verification record
    const { error: verificationError } = await supabase
      .from("email_verifications")
      .insert({
        email,
        token: verificationToken,
        expires_at: expiresAt.toISOString()
      });

    if (verificationError) {
      console.error("Error creating verification record:", verificationError);
      throw new Error("Failed to create verification record");
    }

    // Store subscriber in database with pending status
    const { data: newSubscriber, error: dbError } = await supabase
      .from("users")
      .insert([{ 
        name, 
        email,
        notify_new_quotes,
        notify_weekly_digest,
        notify_whatsapp,
        whatsapp_phone,
        email_status: 'pending',
        email_verification_token: verificationToken
      }])
      .select()
      .single();

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

    return await sendVerificationEmail(email, name, verificationToken);

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

async function sendVerificationEmail(email: string, name: string, token: string) {
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

  try {
    const verificationUrl = `${Deno.env.get('SITE_URL')}/verify-email?token=${token}`;
    
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ZTF Books <onboarding@resend.dev>",
        to: [email],
        subject: "Verify your email - ZTF Books",
        html: `
          <h1>Welcome to ZTF Books, ${name}!</h1>
          <p>Please verify your email address by clicking the link below:</p>
          <p><a href="${verificationUrl}">Verify Email Address</a></p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <p>Best regards,<br>ZTF Books Team</p>
        `,
      }),
    });

    if (!emailRes.ok) {
      const error = await emailRes.text();
      console.error("Resend API error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send verification email" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Verification email sent successfully");
    return new Response(
      JSON.stringify({ 
        message: "Please check your email to verify your subscription",
        subscriber_id: token
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending verification email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send verification email" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}

serve(handler);