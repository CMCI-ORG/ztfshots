import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Category } from "../types";

const CATEGORIES_QUERY_KEY = ["categories"] as const;

export const useCategoriesData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories, error: fetchError } = useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: async () => {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*");

      if (categoriesError) throw categoriesError;

      const { data: quoteCounts, error: countError } = await supabase
        .from("category_quote_counts")
        .select("*");

      if (countError) throw countError;

      const categoriesWithCounts = categoriesData.map((category) => ({
        ...category,
        quote_count: quoteCounts.find((count) => count.category_id === category.id)?.quote_count || 0,
      }));

      return categoriesWithCounts.sort((a, b) => a.name.localeCompare(b.name));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Delete mutation error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive",
      });
    },
  });

  return {
    categories,
    fetchError,
    deleteCategory: deleteMutation.mutate,
  };
};