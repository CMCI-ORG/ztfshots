import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WhatsAppError extends Error {
  code?: string;
  details?: string;
}

interface WhatsAppRequest {
  phone_number: string;
  subscriber_id: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Starting WhatsApp verification process");

    const { phone_number, subscriber_id } = await req.json() as WhatsAppRequest;
    
    if (!phone_number || !subscriber_id) {
      console.error("Missing required fields:", { phone_number, subscriber_id });
      throw new Error("phone_number and subscriber_id are required");
    }

    console.log('Verifying WhatsApp number:', phone_number, 'for subscriber:', subscriber_id);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get WhatsApp API configuration
    const whatsappToken = Deno.env.get('WHATSAPP_API_TOKEN');
    const whatsappPhoneId = Deno.env.get('WHATSAPP_PHONE_ID');

    if (!whatsappToken || !whatsappPhoneId) {
      console.error("Missing WhatsApp API configuration");
      throw new Error('WhatsApp API configuration is missing');
    }

    // Format and validate the phone number
    const formattedPhone = phone_number.replace(/\s+/g, '').replace(/^(?!\+)/, '+');
    if (!/^\+\d{10,15}$/.test(formattedPhone)) {
      console.error("Invalid phone number format:", formattedPhone);
      throw new Error('Invalid phone number format');
    }

    // Send verification message using WhatsApp API
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${whatsappPhoneId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${whatsappToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: formattedPhone,
          type: "template",
          template: {
            name: "verification",
            language: {
              code: "en"
            }
          }
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json();
      console.error('WhatsApp API error:', errorData);
      throw new Error(`WhatsApp API error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('WhatsApp verification message sent:', result);

    // Update subscriber status
    const { error: updateError } = await supabaseClient
      .from('subscribers')
      .update({
        whatsapp_verified: true,
        notify_whatsapp: true,
        whatsapp_phone: formattedPhone
      })
      .eq('id', subscriber_id);

    if (updateError) {
      console.error('Error updating subscriber:', updateError);
      throw updateError;
    }

    console.log("WhatsApp verification process completed successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Verification message sent',
        messageId: result.messages?.[0]?.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    const typedError = error as WhatsAppError;
    console.error('Error in verify-whatsapp function:', {
      message: typedError.message,
      code: typedError.code,
      details: typedError.details,
      stack: typedError.stack
    });
    
    return new Response(
      JSON.stringify({ 
        error: typedError.message,
        code: typedError.code || "UNKNOWN_ERROR",
        details: typedError.details
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})