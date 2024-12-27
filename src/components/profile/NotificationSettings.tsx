import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const NotificationSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ["user-preferences", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("users")
        .select("notify_new_quotes, notify_weekly_digest, notify_whatsapp, whatsapp_phone")
        .eq("id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data || {
        notify_new_quotes: false,
        notify_weekly_digest: false,
        notify_whatsapp: false,
        whatsapp_phone: "",
      };
    },
    enabled: !!user,
  });

  const updatePreferences = useMutation({
    mutationFn: async (values: typeof preferences) => {
      if (!user?.id || !values) throw new Error("No user ID or values");
      const { error } = await supabase
        .from("users")
        .update(values)
        .eq("id", user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-preferences"] });
      toast.success("Preferences updated successfully");
    },
    onError: (error) => {
      console.error("Error updating preferences:", error);
      toast.error("Failed to update preferences");
    },
  });

  if (isLoading || !preferences) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="notify_new_quotes">Notify about new quotes</Label>
        <Switch
          id="notify_new_quotes"
          checked={preferences.notify_new_quotes}
          onCheckedChange={(checked) =>
            updatePreferences.mutate({ ...preferences, notify_new_quotes: checked })
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="notify_weekly_digest">Receive weekly digest</Label>
        <Switch
          id="notify_weekly_digest"
          checked={preferences.notify_weekly_digest}
          onCheckedChange={(checked) =>
            updatePreferences.mutate({ ...preferences, notify_weekly_digest: checked })
          }
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="notify_whatsapp">WhatsApp notifications</Label>
          <Switch
            id="notify_whatsapp"
            checked={preferences.notify_whatsapp}
            onCheckedChange={(checked) =>
              updatePreferences.mutate({ ...preferences, notify_whatsapp: checked })
            }
          />
        </div>
        {preferences.notify_whatsapp && (
          <div className="space-y-2">
            <Label htmlFor="whatsapp_phone">WhatsApp Phone Number</Label>
            <Input
              id="whatsapp_phone"
              value={preferences.whatsapp_phone || ""}
              onChange={(e) =>
                updatePreferences.mutate({
                  ...preferences,
                  whatsapp_phone: e.target.value,
                })
              }
              placeholder="+1234567890"
            />
          </div>
        )}
      </div>
    </div>
  );
};