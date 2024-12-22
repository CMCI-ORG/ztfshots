import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const QuoteNotifications = () => {
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'quotes'
        },
        async (payload) => {
          // Show UI notification
          toast({
            title: "New Quote Added",
            description: `A new quote has been added: "${payload.new.text.substring(0, 50)}${payload.new.text.length > 50 ? '...' : ''}"`,
          });

          // Trigger email notifications
          try {
            const { error } = await supabase.functions.invoke('send-quote-notification', {
              body: { quote_id: payload.new.id }
            });

            if (error) {
              console.error('Failed to send email notifications:', error);
              toast({
                title: "Notification Error",
                description: "Failed to send email notifications",
                variant: "destructive",
              });
            }
          } catch (error) {
            console.error('Error invoking notification function:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return null;
};