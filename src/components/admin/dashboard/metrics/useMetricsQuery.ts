import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useMetricsQuery = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      try {
        const [quotesCount, authorsCount, categoriesCount] = await Promise.all([
          supabase.from("quotes").select("*", { count: "exact", head: true }),
          supabase.from("authors").select("*", { count: "exact", head: true }),
          supabase.from("categories").select("*", { count: "exact", head: true }),
        ]);

        if (quotesCount.error || authorsCount.error || categoriesCount.error) {
          throw new Error("Failed to fetch metrics");
        }

        return {
          quotes: quotesCount.count || 0,
          authors: authorsCount.count || 0,
          categories: categoriesCount.count || 0,
        };
      } catch (error) {
        console.error("Error fetching metrics:", error);
        toast({
          title: "Error loading metrics",
          description: "Please try again later",
          variant: "destructive",
        });
        throw error;
      }
    },
    meta: {
      errorHandler: (error: Error) => {
        console.error("Query error:", error);
        toast({
          title: "Error fetching metrics",
          description: error.message || "Please try again later",
          variant: "destructive",
        });
      }
    }
  });
};