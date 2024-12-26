import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const logError = async (error: Error, additionalInfo?: Record<string, any>) => {
  try {
    const errorDetails = {
      error_message: error.message,
      error_stack: error.stack,
      browser_info: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        ...additionalInfo
      },
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    const { error: logError } = await supabase
      .from('error_logs')
      .insert({
        error_message: error.message,
        error_stack: error.stack,
        browser_info: errorDetails.browser_info,
        url: errorDetails.url
      });

    if (logError) {
      console.error('Failed to log error:', logError);
      throw logError;
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('Error Details');
      console.error('Error:', error);
      console.info('Additional Info:', additionalInfo);
      console.groupEnd();
    }
  } catch (e) {
    console.error('Error in error logging:', e);
  }
};

export const useErrorTracking = () => {
  const { toast } = useToast();

  const trackError = async (error: Error, showToast = true, severity: 'low' | 'medium' | 'high' = 'medium') => {
    await logError(error);
    
    if (showToast) {
      const toastMessages = {
        low: {
          title: "Minor Issue Detected",
          description: "A non-critical error occurred. You can continue using the application.",
        },
        medium: {
          title: "Error Occurred",
          description: error.message || "An unexpected error occurred. Please try again.",
        },
        high: {
          title: "Critical Error",
          description: "A serious error occurred. Please refresh the page or contact support.",
        }
      };

      const message = toastMessages[severity];
      
      toast({
        title: message.title,
        description: message.description,
        variant: "destructive",
        duration: severity === 'high' ? 8000 : 5000,
      });
    }

    return {
      error,
      timestamp: new Date().toISOString(),
      severity
    };
  };

  return { trackError };
};