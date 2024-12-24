import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ProcessScheduledQuotesButton = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const processScheduledQuotes = async () => {
    try {
      setIsProcessing(true);
      const { data, error } = await supabase.functions.invoke('process-scheduled-quotes');
      
      if (error) {
        console.error('Error processing scheduled quotes:', error);
        toast({
          title: "Processing Error",
          description: "Failed to process scheduled quotes. Please check the logs.",
          variant: "destructive",
        });
        return;
      }

      console.log('Processed scheduled quotes:', data);
      toast({
        title: "Success",
        description: `Processed ${data?.updated || 0} scheduled quotes`,
      });
    } catch (error) {
      console.error('Error invoking function:', error);
      toast({
        title: "System Error",
        description: "An unexpected error occurred while processing quotes",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button 
      onClick={processScheduledQuotes} 
      disabled={isProcessing}
      variant="outline"
      size="sm"
    >
      {isProcessing ? "Processing..." : "Process Scheduled Quotes"}
    </Button>
  );
};