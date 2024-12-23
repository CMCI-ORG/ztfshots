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
          console.log('New quote detected:', payload.new);

          // Show UI notification
          toast({
            title: "New Quote Added",
            description: `A new quote has been added: "${payload.new.text.substring(0, 50)}${payload.new.text.length > 50 ? '...' : ''}"`,
          });

          // Trigger email notifications
          try {
            console.log('Triggering email notifications for quote:', payload.new.id);
            
            const { data, error } = await supabase.functions.invoke('send-quote-notification', {
              body: { quote_id: payload.new.id }
            });

            if (error) {
              console.error('Failed to send email notifications:', error);
              toast({
                title: "Notification Error",
                description: "Failed to send email notifications. Please check the logs.",
                variant: "destructive",
              });
              return;
            }

            console.log('Email notifications sent successfully:', data);
            toast({
              title: "Notifications Sent",
              description: "Email notifications have been sent to subscribers",
            });

          } catch (error) {
            console.error('Error invoking notification function:', error);
            toast({
              title: "System Error",
              description: "An unexpected error occurred while sending notifications",
              variant: "destructive",
            });
          }
        }
      )
      .subscribe();

    // Log successful subscription
    console.log('Subscribed to quote changes');

    return () => {
      console.log('Unsubscribing from quote changes');
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return null;
};