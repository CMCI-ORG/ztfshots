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

          try {
            await createVerificationRecord(supabase, subscriptionData.email, verificationToken, expiresAt);
            await sendVerificationEmail(subscriptionData.email, subscriptionData.name, verificationToken, RESEND_API_KEY!, SITE_URL);
            
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
          } catch (error) {
            console.error("Error handling pending verification:", error);
            throw new Error("Failed to process verification. Please try again.");
          }
        }
        
        return new Response(
          JSON.stringify({ 
            error: "This email is already subscribed.",
            status: "already_subscribed"
          }),
          { 
            status: 400, 
            headers: corsHeaders 
          }
        );
      }
    } catch (error) {
      console.error("Database error checking existing subscriber:", error);
      throw new Error("Failed to check subscription status. Please try again.");
    }

    // Generate verification token
    const verificationToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    try {
      // Create verification record first
      await createVerificationRecord(supabase, subscriptionData.email, verificationToken, expiresAt);
      
      // Then create subscriber
      const userId = await createSubscriber(supabase, subscriptionData, verificationToken);
      console.log(`Created new subscriber with ID: ${userId}`);
      
      // Finally send verification email
      await sendVerificationEmail(subscriptionData.email, subscriptionData.name, verificationToken, RESEND_API_KEY!, SITE_URL);
      
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
    } catch (error) {
      console.error("Error in subscription process:", error);
      throw new Error("Failed to complete subscription. Please try again.");
    }

  } catch (error: any) {
    console.error("Error in subscribe function:", error);
    
    const errorMessage = error.message || "Failed to process your subscription. Please try again.";
    const statusCode = error.message.includes("already registered") ? 400 : 500;

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