import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { classifyError, calculateNextRetryTime } from "@/utils/notificationErrors";

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
                  const classifiedError = classifyError(error);
                  
                  toast({
                    title: "Notification Error",
                    description: classifiedError.message,
                    variant: "destructive",
                  });

                  // Record failed notification for retry if retryable
                  if (classifiedError.retryable) {
                    await supabase.from("email_notifications").insert({
                      quote_id: payload.new.id,
                      subscriber_id: error.meta?.userId || 'system',
                      type: 'quote',
                      status: 'failed',
                      error_message: classifiedError.message,
                      retry_count: 0,
                      next_retry_at: calculateNextRetryTime(0).toISOString()
                    });

                    console.error('Notification failed but scheduled for retry:', {
                      error: classifiedError,
                      quoteId: payload.new.id,
                      nextRetry: calculateNextRetryTime(0)
                    });
                  } else {
                    console.error('Notification failed permanently:', {
                      error: classifiedError,
                      quoteId: payload.new.id
                    });
                  }

                  return;
                }
                
                const recipientCount = data?.recipientCount || 'all';
                toast({
                  title: "Notifications Sent",
                  description: `Email notifications have been sent to ${recipientCount} subscribers`,
                });

              } catch (error: any) {
                console.error('Error invoking notification function:', {
                  error,
                  quoteId: payload.new.id,
                  timestamp: new Date().toISOString()
                });
                
                const classifiedError = classifyError(error);

                toast({
                  title: "System Error",
                  description: classifiedError.message,
                  variant: "destructive",
                });

                // Record system error for retry if retryable
                if (classifiedError.retryable) {
                  await supabase.from("email_notifications").insert({
                    quote_id: payload.new.id,
                    subscriber_id: 'system',
                    type: 'quote',
                    status: 'failed',
                    error_message: classifiedError.message,
                    retry_count: 0,
                    next_retry_at: calculateNextRetryTime(0).toISOString()
                  });

                  console.error('System error scheduled for retry:', {
                    error: classifiedError,
                    quoteId: payload.new.id,
                    nextRetry: calculateNextRetryTime(0)
                  });
                }
              }
            }
          }
        )
        .subscribe((status: any) => {
          if (status === 'SUBSCRIPTION_ERROR') {
            console.error('Failed to subscribe to quote changes:', {
              status,
              timestamp: new Date().toISOString()
            });
            
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
      console.error('Error setting up notification subscription:', {
        error,
        timestamp: new Date().toISOString(),
        context: 'QuoteNotifications setup'
      });
      
      toast({
        title: "Setup Error",
        description: "Failed to initialize notification system. Please refresh the page.",
        variant: "destructive",
      });
    }
  }, [toast]);

  return null;
};