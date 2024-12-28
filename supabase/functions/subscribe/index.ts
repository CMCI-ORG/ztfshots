import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE_URL = Deno.env.get("SITE_URL") || "http://localhost:3000";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

class SubscriptionError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code: string = "SUBSCRIPTION_ERROR"
  ) {
    super(message);
    this.name = "SubscriptionError";
  }
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Subscription request received");

  try {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const subscriptionData = await req.json().catch((error) => {
      console.error("Failed to parse request body:", error);
      throw new SubscriptionError("Invalid request body", 400, "INVALID_REQUEST");
    });

    console.log("Processing subscription for:", subscriptionData);

    // Check for existing subscriber
    const { data: existingSubscriber, error: checkError } = await supabase
      .from("users")
      .select("id, email_status")
      .eq("email", subscriptionData.email)
      .maybeSingle();

    if (checkError) {
      console.error("Database error checking existing subscriber:", checkError);
      throw new SubscriptionError("Failed to check subscription status", 500);
    }

    if (existingSubscriber) {
      if (existingSubscriber.email_status === 'pending') {
        // Generate new verification token
        const verificationToken = crypto.randomUUID();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        try {
          // Update existing verification record
          const { error: verificationError } = await supabase
            .from("email_verifications")
            .insert({
              email: subscriptionData.email,
              token: verificationToken,
              expires_at: expiresAt.toISOString()
            });

          if (verificationError) {
            console.error("Error creating verification record:", verificationError);
            throw new SubscriptionError("Failed to create verification record");
          }

          // Send new verification email
          const emailResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: "Daily Dose from Z.T. Fomum <onboarding@resend.dev>",
              to: [subscriptionData.email],
              subject: "Verify your subscription",
              html: `
                <h2>Welcome to Daily Dose from Z.T. Fomum!</h2>
                <p>Hello ${subscriptionData.name},</p>
                <p>Please verify your email address by clicking the link below:</p>
                <p><a href="${SITE_URL}/verify-email?token=${verificationToken}">Verify Email Address</a></p>
                <p>This link will expire in 24 hours.</p>
              `,
            }),
          });

          if (!emailResponse.ok) {
            const errorText = await emailResponse.text();
            console.error("Failed to send verification email:", errorText);
            throw new SubscriptionError("Failed to send verification email");
          }

          return new Response(
            JSON.stringify({
              message: "A new verification email has been sent. Please check your inbox.",
              status: "pending_verification"
            }),
            { headers: corsHeaders }
          );
        } catch (error) {
          console.error("Error handling pending verification:", error);
          throw new SubscriptionError(
            "Failed to process verification. Please try again.",
            500
          );
        }
      }

      throw new SubscriptionError(
        "This email is already subscribed.",
        400,
        "ALREADY_SUBSCRIBED"
      );
    }

    // Create new subscriber
    const verificationToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Start a transaction
    const { error: verificationError } = await supabase
      .from("email_verifications")
      .insert({
        email: subscriptionData.email,
        token: verificationToken,
        expires_at: expiresAt.toISOString()
      });

    if (verificationError) {
      console.error("Error creating verification record:", verificationError);
      throw new SubscriptionError("Failed to create verification record");
    }

    // Create the subscriber
    const { error: subscriberError } = await supabase
      .from("users")
      .insert({
        email: subscriptionData.email,
        name: subscriptionData.name,
        nation: subscriptionData.nation,
        notify_new_quotes: subscriptionData.notify_new_quotes,
        notify_weekly_digest: subscriptionData.notify_weekly_digest,
        notify_whatsapp: subscriptionData.notify_whatsapp,
        whatsapp_phone: subscriptionData.whatsapp_phone,
        email_status: 'pending',
        email_verification_token: verificationToken
      });

    if (subscriberError) {
      console.error("Error creating subscriber:", subscriberError);
      throw new SubscriptionError("Failed to create subscriber");
    }

    // Send verification email
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Daily Dose from Z.T. Fomum <onboarding@resend.dev>",
        to: [subscriptionData.email],
        subject: "Verify your subscription",
        html: `
          <h2>Welcome to Daily Dose from Z.T. Fomum!</h2>
          <p>Hello ${subscriptionData.name},</p>
          <p>Please verify your email address by clicking the link below:</p>
          <p><a href="${SITE_URL}/verify-email?token=${verificationToken}">Verify Email Address</a></p>
          <p>This link will expire in 24 hours.</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Failed to send verification email:", errorText);
      throw new SubscriptionError("Failed to send verification email");
    }

    return new Response(
      JSON.stringify({
        message: "Please check your email to verify your subscription",
        status: "verification_sent"
      }),
      { headers: corsHeaders }
    );

  } catch (error: any) {
    console.error("Error in subscribe function:", {
      error,
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    const subscriptionError = error instanceof SubscriptionError 
      ? error 
      : new SubscriptionError(error.message || "An unexpected error occurred");
    
    return new Response(
      JSON.stringify({ 
        error: subscriptionError.message,
        status: "error",
        code: subscriptionError.code
      }),
      { 
        status: subscriptionError.status, 
        headers: corsHeaders 
      }
    );
  }
};

serve(handler);