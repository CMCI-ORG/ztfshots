import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const logError = async (error: Error, additionalInfo?: Record<string, any>) => {
  try {
    const browserInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      ...additionalInfo
    };

    const { error: logError } = await supabase
      .from('error_logs')
      .insert({
        error_message: error.message,
        error_stack: error.stack,
        browser_info: browserInfo,
        url: window.location.href
      });

    if (logError) {
      console.error('Failed to log error:', logError);
    }
  } catch (e) {
    console.error('Error in error logging:', e);
  }
};

export const useErrorTracking = () => {
  const { toast } = useToast();

  const trackError = async (error: Error, showToast = true) => {
    await logError(error);
    
    if (showToast) {
      toast({
        title: "An error occurred",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { trackError };
};