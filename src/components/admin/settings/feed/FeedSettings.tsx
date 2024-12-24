import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FeedSettingsForm } from "./FeedSettingsForm";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Power } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type FeedSettings = {
  id: string;
  rss_url: string;
  section_title: string;
  feed_count: number;
  footer_position: "none" | "column_1" | "column_2" | "column_3" | "column_4";
  footer_order: number;
  status?: "active" | "inactive";
};

export function FeedSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<FeedSettings | null>(null);

  const { data: feeds, isLoading } = useQuery({
    queryKey: ["feed-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feed_settings")
        .select("*");

      if (error) {
        console.error("Error fetching feed settings:", error);
        throw error;
      }
      return data as FeedSettings[];
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: Partial<FeedSettings>) => {
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

  const handleEdit = (feed: FeedSettings) => {
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
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Feed
        </Button>
      </div>

      {isFormOpen && (
        <FeedSettingsForm
          defaultValues={defaultValues}
          onSubmit={(data) => mutation.mutate(data)}
          isSubmitting={mutation.isPending}
        />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Section Title</TableHead>
              <TableHead>RSS URL</TableHead>
              <TableHead>Footer Position</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feeds?.map((feed) => (
              <TableRow key={feed.id}>
                <TableCell>{feed.section_title}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {feed.rss_url}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {feed.footer_position.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>{feed.footer_order}</TableCell>
                <TableCell>{feed.feed_count}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(feed)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(feed.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {feeds?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No feeds found. Click the "Add New Feed" button to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}