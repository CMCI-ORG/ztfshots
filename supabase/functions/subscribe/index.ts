import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { validateSubscriptionRequest } from "./validation.ts";
import { validateInputs } from "./services/validationService.ts";
import { createVerificationRecord } from "./services/verificationService.ts";
import { sendVerificationEmail } from "./services/emailService.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const handler = async (req: Request): Promise<Response> => {
  console.log("Subscription request received");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
    validateInputs(subscriptionData);
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
      if (existingSubscriber.email_status === "pending") {
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
          throw new Error("Failed to process verification. Please try again.");
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
          email_status: "pending",
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