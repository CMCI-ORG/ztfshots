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
            // Handle quote status changes (scheduled -> live)
            if (payload.eventType === 'UPDATE' && 
                payload.old?.status === 'scheduled' && 
                payload.new?.status === 'live') {
              
              toast({
                title: "Scheduled Quote Now Live",
                description: `A scheduled quote is now live: "${payload.new.text.substring(0, 50)}${payload.new.text.length > 50 ? '...' : ''}"`,
              });
            }

            // Handle new quotes
            if (payload.eventType === 'INSERT' && payload.new?.status === 'live') {
              if (!payload.new?.id) {
                console.error('Invalid quote payload received:', payload);
                return;
              }

              toast({
                title: "New Quote Added",
                description: `A new quote has been added: "${payload.new.text.substring(0, 50)}${payload.new.text.length > 50 ? '...' : ''}"`,
              });

              try {                
                const { data, error } = await supabase.functions.invoke('send-quote-notification', {
                  body: { quote_id: payload.new.id }
                });

                if (error) {
                  console.error('Failed to send email notifications:', error);
                  let errorMessage = "Failed to send email notifications.";
                  
                  // Enhanced error handling with specific error messages
                  if (error.message?.includes('rate limit')) {
                    errorMessage = "Rate limit exceeded. Notifications will be retried automatically.";
                  } else if (error.message?.includes('verification')) {
                    errorMessage = "Email verification issue. Please check subscriber status.";
                  } else if (error.message?.includes('invalid email')) {
                    errorMessage = "Invalid email addresses detected. Please check subscriber list.";
                  } else if (error.message?.includes('timeout')) {
                    errorMessage = "Service timeout. Notifications will be retried automatically.";
                  }

                  toast({
                    title: "Notification Error",
                    description: errorMessage,
                    variant: "destructive",
                  });

                  // Record failed notification for retry
                  await supabase.from("email_notifications").insert({
                    quote_id: payload.new.id,
                    subscriber_id: error.meta?.userId || 'system', // Add subscriber_id
                    type: 'quote', // Add type field
                    status: 'failed',
                    error_message: error.message,
                    retry_count: 0,
                    next_retry_at: new Date(Date.now() + 5 * 60000).toISOString() // Retry in 5 minutes
                  });

                  return;
                }
                
                const recipientCount = data?.recipientCount || 'all';
                toast({
                  title: "Notifications Sent",
                  description: `Email notifications have been sent to ${recipientCount} subscribers`,
                });

              } catch (error: any) {
                console.error('Error invoking notification function:', error);
                
                let errorTitle = "System Error";
                let errorMessage = "An unexpected error occurred while sending notifications";

                // Enhanced error categorization
                if (error.code === 'NETWORK_ERROR') {
                  errorMessage = "Network error. Notifications will be retried automatically.";
                } else if (error.code === 'TIMEOUT_ERROR') {
                  errorMessage = "Request timed out. Notifications will be retried automatically.";
                } else if (error.code === 'SERVICE_ERROR') {
                  errorMessage = "Email service is currently unavailable. Retrying later.";
                }

                toast({
                  title: errorTitle,
                  description: errorMessage,
                  variant: "destructive",
                });

                // Record system error for retry
                await supabase.from("email_notifications").insert({
                  quote_id: payload.new.id,
                  subscriber_id: 'system', // Add subscriber_id
                  type: 'quote', // Add type field
                  status: 'failed',
                  error_message: error.message,
                  retry_count: 0,
                  next_retry_at: new Date(Date.now() + 5 * 60000).toISOString()
                });
              }
            }
          }
        )
        .subscribe((status: any) => {
          if (status === 'SUBSCRIPTION_ERROR') {
            console.error('Failed to subscribe to quote changes');
            toast({
              title: "Subscription Error",
              description: "Failed to subscribe to quote notifications. Please refresh the page.",
              variant: "destructive",
            });
          }
        });

      return () => {
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