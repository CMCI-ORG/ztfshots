import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SubscriptionRequest } from "./validation.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function checkExistingSubscriber(email: string) {
  console.log("Checking for existing subscriber:", email);
  
  try {
    const { data: existingSubscriber, error } = await supabase
      .from("users")
      .select("email, email_status")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Database error checking existing subscriber:", error);
      throw new Error("Failed to check existing subscription");
    }

    console.log("Existing subscriber check result:", existingSubscriber);
    return existingSubscriber;
  } catch (err) {
    console.error("Error in checkExistingSubscriber:", err);
    throw err;
  }
}

export async function createVerificationRecord(email: string, verificationToken: string, expiresAt: Date) {
  console.log("Creating verification record for:", email);
  
  try {
    // First check if the email_verifications table exists
    const { error: tableCheckError } = await supabase
      .from("email_verifications")
      .select("id")
      .limit(1);

    if (tableCheckError) {
      console.error("Error checking email_verifications table:", tableCheckError);
      throw new Error("Email verification system is not properly configured");
    }

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

    console.log("Verification record created successfully");
  } catch (err) {
    console.error("Error in createVerificationRecord:", err);
    throw err;
  }
}

export async function createSubscriber(subscriptionData: SubscriptionRequest, verificationToken: string) {
  console.log("Creating new subscriber:", subscriptionData.email);
  
  try {
    // Generate a new UUID for the user
    const userId = crypto.randomUUID();

    const { error: dbError } = await supabase
      .from("users")
      .insert([{ 
        id: userId,
        email: subscriptionData.email,
        name: subscriptionData.name,
        nation: subscriptionData.nation,
        notify_new_quotes: subscriptionData.notify_new_quotes,
        notify_weekly_digest: subscriptionData.notify_weekly_digest,
        notify_whatsapp: subscriptionData.notify_whatsapp,
        whatsapp_phone: subscriptionData.whatsapp_phone,
        email_status: 'pending',
        email_verification_token: verificationToken,
        role: 'subscriber',
        status: 'active'
      }]);

    if (dbError) {
      console.error("Database error creating subscriber:", dbError);
      if (dbError.code === '23505') {
        throw new Error("This email is already registered. Please check your inbox for the verification email.");
      }
      throw new Error("Failed to create your subscription. Please try again.");
    }

    console.log("Subscriber created successfully:", userId);
    return userId;
  } catch (err) {
    console.error("Error in createSubscriber:", err);
    throw err;
  }
}