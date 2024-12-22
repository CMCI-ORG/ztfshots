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
        (payload) => {
          toast({
            title: "New Quote Added",
            description: `A new quote has been added: "${payload.new.text.substring(0, 50)}${payload.new.text.length > 50 ? '...' : ''}"`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return null;
};