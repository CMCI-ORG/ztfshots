import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FeedSettingsForm } from "./FeedSettingsForm";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FeedSettingsTable } from "./FeedSettingsTable";
import { FeedSettings as FeedSettingsType } from "./types";

export function FeedSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<FeedSettingsType | null>(null);

  const { data: feeds, isLoading } = useQuery({
    queryKey: ["feed-settings"],
    queryFn: async () => {
      console.log("Fetching all feed settings");
      const { data, error } = await supabase
        .from("feed_settings")
        .select("*")
        .order('footer_order', { ascending: true });

      if (error) {
        console.error("Error fetching feed settings:", error);
        throw error;
      }
      console.log("Retrieved feed settings:", data);
      return data as FeedSettingsType[];
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: Partial<FeedSettingsType>) => {
      const { data, error } = await supabase
        .from("feed_settings")
        .upsert({
          id: selectedFeed?.id, // Include the ID when updating
          ...values,
          rss_url: values.rss_url || "",
          section_title: values.section_title || "Latest Updates",
          feed_count: values.feed_count || 5,
          footer_position: values.footer_position || "none",
          footer_order: values.footer_order || 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-settings"] });
      toast({
        title: "Success",
        description: `Feed settings have been ${selectedFeed ? 'updated' : 'created'}.`,
      });
      setIsFormOpen(false);
      setSelectedFeed(null);
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

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("feed_settings")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-settings"] });
      toast({
        title: "Success",
        description: "Feed has been deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete feed. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting feed:", error);
    },
  });

  const handleEdit = (feed: FeedSettingsType) => {
    setSelectedFeed(feed);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this feed?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const defaultValues = selectedFeed || {
    rss_url: "",
    section_title: "Latest Updates",
    feed_count: 5,
    footer_position: "none" as const,
    footer_order: 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">RSS Feed Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure the RSS feed display settings for your site.
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => {
          setSelectedFeed(null);
          setIsFormOpen(true);
        }} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Feed
        </Button>
      </div>

      {isFormOpen && (
        <FeedSettingsForm
          defaultValues={defaultValues}
          onSubmit={(data) => mutation.mutate({ ...data, id: selectedFeed?.id })}
          isSubmitting={mutation.isPending}
        />
      )}

      <FeedSettingsTable
        feeds={feeds}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}