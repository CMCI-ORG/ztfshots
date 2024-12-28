import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { validateSubscriptionRequest, SubscriptionRequest } from "./validation.ts";
import { checkExistingSubscriber, createVerificationRecord, createSubscriber } from "./databaseService.ts";
import { sendVerificationEmail } from "./emailService.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE_URL = Deno.env.get("SITE_URL") || "http://localhost:3000";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

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

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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

    // Validate subscription data
    const validationResult = validateSubscriptionRequest(subscriptionData);
    if (!validationResult.isValid) {
      throw new SubscriptionError(validationResult.error!, 400, "VALIDATION_ERROR");
    }

    // Check for existing subscriber
    const existingSubscriber = await checkExistingSubscriber(supabase, subscriptionData.email);
    
    if (existingSubscriber) {
      if (existingSubscriber.email_status === 'pending') {
        // Generate new verification token
        const verificationToken = crypto.randomUUID();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        try {
          await createVerificationRecord(supabase, subscriptionData.email, verificationToken, expiresAt);
          await sendVerificationEmail(
            subscriptionData.email,
            subscriptionData.name,
            verificationToken,
            RESEND_API_KEY!,
            SITE_URL
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

    try {
      // Create verification record
      await createVerificationRecord(supabase, subscriptionData.email, verificationToken, expiresAt);
      
      // Create the subscriber
      await createSubscriber(supabase, subscriptionData, verificationToken);

      // Send verification email
      await sendVerificationEmail(
        subscriptionData.email,
        subscriptionData.name,
        verificationToken,
        RESEND_API_KEY!,
        SITE_URL
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
      throw new SubscriptionError(error.message || "Failed to complete subscription process");
    }

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