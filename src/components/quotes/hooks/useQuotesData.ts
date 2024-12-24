import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useQuotesData(statusFilter: string = 'all') {
  return useQuery({
    queryKey: ["quotes", statusFilter],
    queryFn: async () => {
      try {
        let query = supabase
          .from("quotes")
          .select(`
            *,
            authors:author_id(name),
            categories:category_id(name)
          `)
          .order("created_at", { ascending: false });
        
        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error fetching quotes:", error);
        throw error;
      }
    },
  });
}