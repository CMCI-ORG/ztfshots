import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { validateSubscriptionRequest } from "./validation.ts";

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

async function createVerificationRecord(email: string, verificationToken: string) {
  console.log("Creating verification record for:", email);
  
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  try {
    // First verify the email_verifications table exists
    const { error: tableCheckError } = await supabase
      .from("email_verifications")
      .select("id")
      .limit(1);

    if (tableCheckError) {
      console.error("Error checking email_verifications table:", tableCheckError);
      throw new Error("Email verification system is not properly configured");
    }

    // Create the verification record
    const { error: verificationError } = await supabase
      .from("email_verifications")
      .insert({
        email,
        token: verificationToken,
        expires_at: expiresAt.toISOString(),
      });

    if (verificationError) {
      console.error("Error creating verification record:", verificationError);
      throw new Error("Failed to create verification record");
    }

    console.log("Verification record created successfully");
    return { success: true };
  } catch (err) {
    console.error("Error in createVerificationRecord:", err);
    throw err;
  }
}

async function sendVerificationEmail(email: string, name: string, verificationToken: string) {
  try {
    const verificationUrl = `${SITE_URL}/verify-email?token=${verificationToken}`;
    
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Daily Dose from Z.T. Fomum <onboarding@resend.dev>',
        to: [email],
        subject: 'Verify your subscription',
        html: `
          <h2>Welcome to Daily Dose from Z.T. Fomum!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for subscribing to our daily inspirational quotes. Please verify your email address by clicking the link below:</p>
          <p><a href="${verificationUrl}">Verify Email Address</a></p>
          <p>This link will expire in 24 hours.</p>
          <p>If you did not create this account, no further action is required.</p>
          <p>Best regards,<br>Daily Dose from Z.T. Fomum Team</p>
        `
      })
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }

    return await res.json();
  } catch (error) {
    console.error('Error in sendVerificationEmail:', error);
    throw new Error('Email service error: Failed to send verification email');
  }
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Subscription request received");

  try {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Test database connection
    const { error: dbConnectionError } = await supabase
      .from("users")
      .select("id")
      .limit(1);

    if (dbConnectionError) {
      console.error("Database connection error:", dbConnectionError);
      throw new Error("Database connection error");
    }

    const subscriptionData = await req.json();
    console.log("Processing subscription for:", subscriptionData);

    // Validate subscription data
    const validationResult = validateSubscriptionRequest(subscriptionData);
    if (!validationResult.isValid) {
      throw new Error(validationResult.error!);
    }

    // Check for existing subscriber
    const { data: existingSubscriber, error: subscriberError } = await supabase
      .from("users")
      .select("email, email_status")
      .eq("email", subscriptionData.email)
      .maybeSingle();

    if (subscriberError) {
      console.error("Error checking existing subscriber:", subscriberError);
      throw new Error("Failed to check existing subscription");
    }

    if (existingSubscriber) {
      if (existingSubscriber.email_status === 'pending') {
        // Generate new verification token
        const verificationToken = crypto.randomUUID();
        
        try {
          await createVerificationRecord(subscriptionData.email, verificationToken);
          await sendVerificationEmail(
            subscriptionData.email,
            subscriptionData.name,
            verificationToken
          );

          return new Response(
            JSON.stringify({
              message: "A new verification email has been sent. Please check your inbox.",
              status: "pending_verification"
            }),
            { headers: corsHeaders }
          );
        } catch (error) {
          console.error("Error handling pending verification:", error);
          throw new Error(
            "Failed to process verification. Please try again."
          );
        }
      }

      throw new Error("This email is already subscribed.");
    }

    // Create new subscriber
    const verificationToken = crypto.randomUUID();

    try {
      // Create verification record first
      await createVerificationRecord(subscriptionData.email, verificationToken);
      
      // Create the subscriber
      const { error: userError } = await supabase
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

      if (userError) {
        console.error("Error creating subscriber:", userError);
        throw new Error("Failed to create subscription");
      }

      // Send verification email
      await sendVerificationEmail(
        subscriptionData.email,
        subscriptionData.name,
        verificationToken
      );

      return new Response(
        JSON.stringify({
          message: "Please check your email to verify your subscription",
          status: "verification_sent"
        }),
        { headers: corsHeaders }
      );
    } catch (error: any) {
      console.error("Error in subscription process:", error);
      throw new Error(error.message || "Failed to complete subscription process");
    }

  } catch (error: any) {
    console.error("Error in subscribe function:", {
      error,
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unexpected error occurred",
        status: "error",
        code: "SUBSCRIPTION_ERROR"
      }),
      { 
        status: 500, 
        headers: corsHeaders 
      }
    );
  }
};

serve(handler);