import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useErrorTracking } from "@/utils/errorTracking";
import { ProfileFormData } from "@/utils/validation";
import { useAuth } from "@/providers/AuthProvider";

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { trackError } = useErrorTracking();
  const { user } = useAuth();

  const updateProfile = async (data: ProfileFormData) => {
    if (!user?.id) return false;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: data.display_name,
          bio: data.bio,
          website: data.website,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
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
    updateProfile,
  };
};