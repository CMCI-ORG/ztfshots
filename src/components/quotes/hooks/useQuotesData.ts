import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useQuotesData() {
  return useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("quotes")
          .select(`
            *,
            authors:author_id(name),
            categories:category_id(name)
          `)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error fetching quotes:", error);
        throw error;
      }
    },
  });
}