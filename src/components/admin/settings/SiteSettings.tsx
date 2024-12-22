import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SiteSettingsForm, SiteSettingsFormData } from "./SiteSettingsForm";

export function SiteSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: SiteSettingsFormData) => {
      const { error } = await supabase
        .from("site_settings")
        .update(values)
        .eq("id", settings?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Site settings have been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SiteSettingsForm
      defaultValues={settings}
      onSubmit={(data) => mutation.mutate(data)}
      isSubmitting={mutation.isPending}
    />
  );
}