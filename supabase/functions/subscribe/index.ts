import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { validateSubscriptionRequest } from "./validation.ts";
import { sendVerificationEmail } from "./emailService.ts";
import { checkExistingSubscriber, createSubscriber, createVerificationRecord } from "./databaseService.ts";

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

const handler = async (req: Request): Promise<Response> => {
  console.log("Subscription request received");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const subscriptionData = await req.json();
    console.log("Processing subscription for:", subscriptionData);

    // Validate request data
    const validation = validateSubscriptionRequest(subscriptionData);
    if (!validation.isValid) {
      console.error("Validation failed:", validation.error);
      return new Response(
        JSON.stringify({ 
          error: validation.error,
          status: "validation_error" 
        }),
        { 
          status: 400, 
          headers: corsHeaders 
        }
      );
    }

    // Check for existing subscriber
    try {
      const existingSubscriber = await checkExistingSubscriber(supabase, subscriptionData.email);
      if (existingSubscriber) {
        if (existingSubscriber.email_status === 'pending') {
          // Generate new verification token and send email
          const verificationToken = crypto.randomUUID();
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 24);

          await createVerificationRecord(supabase, subscriptionData.email, verificationToken, expiresAt);
          
          try {
            await sendVerificationEmail(subscriptionData.email, subscriptionData.name, verificationToken, RESEND_API_KEY!, SITE_URL);
          } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
            throw new Error("Failed to send verification email. Please try again later.");
          }

          return new Response(
            JSON.stringify({ 
              message: "A new verification email has been sent. Please check your inbox.",
              status: "pending_verification"
            }),
            { 
              status: 200, 
              headers: corsHeaders 
            }
          );
        }
        
        return new Response(
          JSON.stringify({ 
            error: "This email is already subscribed. Please use a different email address.",
            status: "already_subscribed"
          }),
          { 
            status: 400, 
            headers: corsHeaders 
          }
        );
      }
    } catch (dbError) {
      console.error("Database error checking existing subscriber:", dbError);
      throw new Error("Failed to check existing subscription. Please try again.");
    }

    // Generate verification token
    const verificationToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Create verification record
    try {
      await createVerificationRecord(supabase, subscriptionData.email, verificationToken, expiresAt);
    } catch (verificationError) {
      console.error("Failed to create verification record:", verificationError);
      throw new Error("Failed to set up email verification. Please try again.");
    }

    // Create subscriber
    try {
      const userId = await createSubscriber(supabase, subscriptionData, verificationToken);
      console.log(`Created new subscriber with ID: ${userId}`);
    } catch (subscriberError) {
      console.error("Failed to create subscriber:", subscriberError);
      throw new Error("Failed to create your subscription. Please try again.");
    }

    // Send verification email
    try {
      await sendVerificationEmail(subscriptionData.email, subscriptionData.name, verificationToken, RESEND_API_KEY!, SITE_URL);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      throw new Error("Failed to send verification email. Please try again later.");
    }

    return new Response(
      JSON.stringify({ 
        message: "Please check your email to verify your subscription",
        status: "verification_sent"
      }),
      { 
        status: 200, 
        headers: corsHeaders 
      }
    );

  } catch (error: any) {
    console.error("Error in subscribe function:", error);
    
    // Provide more specific error messages based on the error type
    let errorMessage = "Failed to process your subscription. ";
    let statusCode = 500;

    if (error.message.includes("already registered")) {
      errorMessage = error.message;
      statusCode = 400;
    } else if (error.message.includes("email service")) {
      errorMessage += "Our email service is temporarily unavailable. Please try again later.";
    } else if (error.message.includes("verification")) {
      errorMessage += "There was an issue with email verification. Please try again.";
    } else {
      errorMessage += "Please try again or contact support if the issue persists.";
    }

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        status: "error",
        code: error.code || "UNKNOWN_ERROR"
      }),
      { 
        status: statusCode, 
        headers: corsHeaders 
      }
    );
  }
};

serve(handler);