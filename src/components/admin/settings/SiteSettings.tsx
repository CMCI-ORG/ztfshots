import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SiteSettingsForm } from "./SiteSettingsForm";
import { SiteSettingsFormData } from "@/integrations/supabase/types/site";
import { SiteSettingsErrorBoundary } from "./SiteSettingsErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export function SiteSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      console.log("Fetching site settings...");
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching site settings:", error);
        throw error;
      }
      console.log("Fetched site settings:", data);
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: SiteSettingsFormData) => {
      console.log("Updating site settings with:", values);
      const { data, error } = await supabase
        .from("site_settings")
        .upsert({ ...values, id: settings?.id || undefined })
        .select()
        .single();

      if (error) {
        console.error("Error updating site settings:", error);
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      console.log("Successfully updated site settings:", data);
      toast({
        title: "Success",
        description: "Site settings have been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: (error) => {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load site settings. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4" data-testid="loading-skeleton">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <SiteSettingsErrorBoundary>
      <SiteSettingsForm
        defaultValues={settings}
        onSubmit={(data) => mutation.mutate(data)}
        isSubmitting={mutation.isPending}
      />
    </SiteSettingsErrorBoundary>
  );
}