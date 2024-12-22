import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SiteSettingsForm } from "./SiteSettingsForm";
import { SiteSettingsFormData } from "@/integrations/supabase/types/site";
import { SiteSettingsErrorBoundary } from "./SiteSettingsErrorBoundary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function SiteSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading, error, refetch } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      console.log("Fetching site settings...");
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .maybeSingle();

      if (error) {
        console.error("Error fetching site settings:", error);
        throw new Error(error.message);
      }

      if (!data) {
        console.log("No site settings found");
        return null;
      }

      // Validate header_display_type to ensure it matches our union type
      const headerDisplayType = data.header_display_type === "logo" ? "logo" : "text";
      
      console.log("Fetched site settings:", data);
      return {
        ...data,
        header_display_type: headerDisplayType as "text" | "logo",
      };
    },
    retry: 2,
    retryDelay: 1000,
  });

  const mutation = useMutation({
    mutationFn: async (values: SiteSettingsFormData) => {
      console.log("Updating site settings with:", values);
      const { data, error } = await supabase
        .from("site_settings")
        .upsert({ ...values, id: settings?.id || undefined })
        .select()
        .maybeSingle();

      if (error) {
        console.error("Error updating site settings:", error);
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("Failed to update site settings");
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
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Failed to load site settings</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>{error instanceof Error ? error.message : "An unexpected error occurred"}</p>
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="mt-2"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
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

  if (!settings) {
    return (
      <Alert className="mb-4">
        <AlertTitle>No settings found</AlertTitle>
        <AlertDescription>
          Create your first site settings by filling out the form below.
        </AlertDescription>
      </Alert>
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