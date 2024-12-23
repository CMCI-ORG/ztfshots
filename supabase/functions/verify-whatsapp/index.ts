import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { phone_number, subscriber_id } = await req.json()
    console.log('Verifying WhatsApp number:', phone_number, 'for subscriber:', subscriber_id)

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get WhatsApp API configuration
    const whatsappToken = Deno.env.get('WHATSAPP_API_TOKEN')
    const whatsappPhoneId = Deno.env.get('WHATSAPP_PHONE_ID')

    if (!whatsappToken || !whatsappPhoneId) {
      throw new Error('WhatsApp API configuration is missing')
    }

    // Format the phone number
    const formattedPhone = phone_number.replace(/\s+/g, '').replace(/^(?!\+)/, '+')

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
      const errorData = await response.json()
      console.error('WhatsApp API error:', errorData)
      throw new Error(`WhatsApp API error: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('WhatsApp verification message sent:', result)

    // Update subscriber status
    const { error: updateError } = await supabaseClient
      .from('subscribers')
      .update({
        whatsapp_verified: true,
        notify_whatsapp: true
      })
      .eq('id', subscriber_id)

    if (updateError) {
      console.error('Error updating subscriber:', updateError)
      throw updateError
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Verification message sent' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in verify-whatsapp function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})