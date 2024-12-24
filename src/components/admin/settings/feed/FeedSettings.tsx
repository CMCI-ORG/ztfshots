import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FeedSettingsForm } from "./FeedSettingsForm";
import { useToast } from "@/components/ui/use-toast";

export function FeedSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["feed-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feed_settings")
        .select("*")
        .maybeSingle();

      if (error) {
        console.error("Error fetching feed settings:", error);
        throw error;
      }
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const { data, error } = await supabase
        .from("feed_settings")
        .upsert(values)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-settings"] });
      toast({
        title: "Success",
        description: "Feed settings have been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update feed settings. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating feed settings:", error);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const defaultValues = settings || {
    rss_url: "",
    section_title: "Latest Updates",
    feed_count: 5,
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">RSS Feed Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure the RSS feed display settings for your site.
        </p>
      </div>
      <FeedSettingsForm
        defaultValues={defaultValues}
        onSubmit={(data) => mutation.mutate(data)}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}