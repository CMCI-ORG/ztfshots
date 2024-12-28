import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export const createVerificationRecord = async (email: string, verificationToken: string) => {
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
};