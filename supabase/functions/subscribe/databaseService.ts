import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SubscriptionRequest } from "./validation.ts";

export async function checkExistingSubscriber(supabase: any, email: string) {
  const { data: existingSubscriber, error } = await supabase
    .from("users")
    .select("email, email_status")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error("Database error checking existing subscriber:", error);
    throw new Error("Failed to check existing subscription");
  }

  return existingSubscriber;
}

export async function createVerificationRecord(supabase: any, email: string, verificationToken: string, expiresAt: Date) {
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
}

export async function createSubscriber(supabase: any, data: SubscriptionRequest, verificationToken: string) {
  // Generate a new UUID for the user
  const userId = crypto.randomUUID();

  const { error: dbError } = await supabase
    .from("users")
    .insert([{ 
      id: userId,  // Explicitly set the ID
      email: data.email,
      name: data.name,
      nation: data.nation,
      notify_new_quotes: data.notify_new_quotes,
      notify_weekly_digest: data.notify_weekly_digest,
      notify_whatsapp: data.notify_whatsapp,
      whatsapp_phone: data.whatsapp_phone,
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

  return userId;
}