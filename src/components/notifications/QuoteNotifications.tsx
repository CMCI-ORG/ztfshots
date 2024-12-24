import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const QuoteNotifications = () => {
  const { toast } = useToast();

  useEffect(() => {
    try {
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'quotes'
          },
          async (payload) => {
            console.log('Quote change detected:', payload);

            // Handle quote status changes (scheduled -> live)
            if (payload.eventType === 'UPDATE' && 
                payload.old?.status === 'scheduled' && 
                payload.new?.status === 'live') {
              console.log('Scheduled quote went live:', payload.new);
              
              toast({
                title: "Scheduled Quote Now Live",
                description: `A scheduled quote is now live: "${payload.new.text.substring(0, 50)}${payload.new.text.length > 50 ? '...' : ''}"`,
              });
            }

            // Handle new quotes
            if (payload.eventType === 'INSERT' && payload.new?.status === 'live') {
              console.log('New live quote detected:', payload.new);

              if (!payload.new?.id) {
                console.error('Invalid quote payload received:', payload);
                return;
              }

              toast({
                title: "New Quote Added",
                description: `A new quote has been added: "${payload.new.text.substring(0, 50)}${payload.new.text.length > 50 ? '...' : ''}"`,
              });

              try {
                console.log('Triggering email notifications for quote:', payload.new.id);
                
                const { data, error } = await supabase.functions.invoke('send-quote-notification', {
                  body: { quote_id: payload.new.id }
                });

                if (error) {
                  console.error('Failed to send email notifications:', error);
                  let errorMessage = "Failed to send email notifications.";
                  
                  if (error.message?.includes('not found')) {
                    errorMessage = "Email notification service is not available.";
                  } else if (error.message?.includes('timeout')) {
                    errorMessage = "Email notification service timed out. Please try again.";
                  } else if (error.message?.includes('unauthorized')) {
                    errorMessage = "Not authorized to send email notifications.";
                  }

                  toast({
                    title: "Notification Error",
                    description: `${errorMessage} Please check the logs.`,
                    variant: "destructive",
                  });
                  return;
                }

                console.log('Email notifications sent successfully:', data);
                
                const recipientCount = data?.recipientCount || 'all';
                toast({
                  title: "Notifications Sent",
                  description: `Email notifications have been sent to ${recipientCount} subscribers`,
                });

              } catch (error: any) {
                console.error('Error invoking notification function:', error);
                
                let errorTitle = "System Error";
                let errorMessage = "An unexpected error occurred while sending notifications";

                if (error.code === 'NETWORK_ERROR') {
                  errorMessage = "Network error. Please check your connection.";
                } else if (error.code === 'TIMEOUT_ERROR') {
                  errorMessage = "Request timed out. Please try again.";
                } else if (error.code === 'SERVICE_ERROR') {
                  errorMessage = "Email service is currently unavailable.";
                }

                toast({
                  title: errorTitle,
                  description: errorMessage,
                  variant: "destructive",
                });
              }
            }
          }
        )
        .subscribe((status: any) => {
          console.log('Subscription status:', status);
          
          if (status === 'SUBSCRIPTION_ERROR') {
            console.error('Failed to subscribe to quote changes');
            toast({
              title: "Subscription Error",
              description: "Failed to subscribe to quote notifications. Please refresh the page.",
              variant: "destructive",
            });
          }
        });

      console.log('Subscribed to quote changes');

      return () => {
        console.log('Unsubscribing from quote changes');
        supabase.removeChannel(channel);
      };
    } catch (error: any) {
      console.error('Error setting up notification subscription:', error);
      toast({
        title: "Setup Error",
        description: "Failed to initialize notification system. Please refresh the page.",
        variant: "destructive",
      });
    }
  }, [toast]);

  return null;
};