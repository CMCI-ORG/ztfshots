import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Source } from "./types";

export function useSourcesQuery() {
  return useQuery({
    queryKey: ["sources"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("sources")
          .select("*")
          .order("title");

        if (error) throw error;
        return (data || []) as Source[];
      } catch (err) {
        console.error("Error fetching sources:", err);
        throw err;
      }
    },
    retry: 2,
    staleTime: 30000, // Cache for 30 seconds
  });
}