import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useErrorTracking } from "@/utils/errorTracking";

export const usePasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { trackError } = useErrorTracking();

  const sendResetEmail = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Reset email sent",
        description: "Check your email for the reset link",
      });
    } catch (error) {
      if (error instanceof Error) {
        trackError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated",
      });

      return true;
    } catch (error) {
      if (error instanceof Error) {
        trackError(error);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    sendResetEmail,
    updatePassword,
  };
};