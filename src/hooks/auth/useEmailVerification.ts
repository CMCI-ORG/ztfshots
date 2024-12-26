import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useErrorTracking } from "@/utils/errorTracking";

export const useEmailVerification = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { trackError } = useErrorTracking();

  const sendVerificationEmail = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;

      toast({
        title: "Verification email sent",
        description: "Please check your email for the verification link",
      });

      return true;
    } catch (error) {
      if (error instanceof Error) {
        trackError(error);
        toast({
          title: "Error sending verification email",
          description: error.message,
          variant: "destructive",
        });
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      });

      if (error) throw error;

      toast({
        title: "Email verified",
        description: "Your email has been successfully verified",
      });

      return true;
    } catch (error) {
      if (error instanceof Error) {
        trackError(error);
        toast({
          title: "Error verifying email",
          description: error.message,
          variant: "destructive",
        });
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    sendVerificationEmail,
    verifyEmail,
  };
};