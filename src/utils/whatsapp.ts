import { supabase } from "@/integrations/supabase/client";

interface WhatsAppMessage {
  to: string;
  templateName: string;
  language: string;
  components?: any[];
}

export const sendWhatsAppMessage = async (message: WhatsAppMessage) => {
  try {
    console.log('Sending WhatsApp message:', message);
    
    const { data, error } = await supabase.functions.invoke('send-whatsapp-message', {
      body: { message }
    });

    if (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }

    console.log('WhatsApp message sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
    throw error;
  }
};