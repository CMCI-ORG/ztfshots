import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WhatsAppMessage {
  to: string;
  templateName: string;
  language: string;
  components?: any[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { message } = await req.json() as { message: WhatsAppMessage }
    console.log('Sending WhatsApp message:', message)

    // Validate required fields
    if (!message.to || !message.templateName || !message.language) {
      throw new Error('Missing required fields in message payload')
    }

    // Format the phone number (remove spaces and ensure it starts with +)
    const formattedPhone = message.to.replace(/\s+/g, '').replace(/^(?!\+)/, '+')

    // Get the WhatsApp API configuration from environment variables
    const whatsappToken = Deno.env.get('WHATSAPP_API_TOKEN')
    const whatsappPhoneId = Deno.env.get('WHATSAPP_PHONE_ID')

    if (!whatsappToken || !whatsappPhoneId) {
      throw new Error('WhatsApp API configuration is missing')
    }

    // Prepare the WhatsApp API request
    const whatsappPayload = {
      messaging_product: "whatsapp",
      to: formattedPhone,
      type: "template",
      template: {
        name: message.templateName,
        language: {
          code: message.language
        },
        components: message.components || []
      }
    }

    console.log('WhatsApp API payload:', whatsappPayload)

    // Send the message using the WhatsApp API
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${whatsappPhoneId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${whatsappToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(whatsappPayload),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('WhatsApp API error:', errorData)
      throw new Error(`WhatsApp API error: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('WhatsApp API response:', result)

    // Update the notifications table with the result
    if (result.messages?.[0]?.id) {
      const { error: dbError } = await supabaseClient
        .from('email_notifications')
        .insert({
          type: 'whatsapp',
          status: 'sent',
          whatsapp_message_id: result.messages[0].id,
          whatsapp_status: 'sent'
        })

      if (dbError) {
        console.error('Error updating notifications table:', dbError)
      }
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in send-whatsapp-message function:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})