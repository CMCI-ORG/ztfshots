import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuoteFilters } from "../../SearchFilterPanel";
import { getTimeRangeFilter } from "./utils/timeRangeFilter";

export const useQuotesQuery = (
  filters: QuoteFilters | undefined,
  currentPage: number,
  itemsPerPage: number,
  showScheduled = false
) => {
  return useQuery({
    queryKey: ["quotes", filters, currentPage, showScheduled],
    queryFn: async () => {
      try {
        let query = supabase
          .from("quotes")
          .select(`
            *,
            authors:author_id(name, image_url),
            categories:category_id(name),
            sources:source_id(title)
          `, { count: 'exact' })
          .order("post_date", { ascending: false })
          .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

        // Only show live quotes in client portal
        if (!showScheduled) {
          query = query.eq('status', 'live');
        }

        // Apply filters if they exist
        if (filters) {
          query = applyFilters(query, filters);
        }

        console.log('Query parameters:', {
          filters,
          currentPage,
          itemsPerPage,
          showScheduled
        });

        const { data, error, count } = await query;
        
        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }

        console.log('Query results:', { data, count });
        return { data: data || [], count: count || 0 };
      } catch (error) {
        console.error('Error in useQuotesQuery:', error);
        throw error;
      }
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
};

const applyFilters = (query: any, filters: QuoteFilters) => {
  if (filters.authorId && filters.authorId !== "all") {
    query = query.eq("author_id", filters.authorId);
  }

  if (filters.categoryId && filters.categoryId !== "all") {
    query = query.eq("category_id", filters.categoryId);
  }

  if (filters.sourceId && filters.sourceId !== "all") {
    query = query.eq("source_id", filters.sourceId);
  }

  if (filters.timeRange && filters.timeRange !== "lifetime") {
    const { startDate, endDate } = getTimeRangeFilter(filters.timeRange);
    if (startDate && endDate) {
      query = query
        .gte("post_date", startDate.toISOString())
        .lte("post_date", endDate.toISOString());
    }
  }

  if (filters.search) {
    query = query.ilike("text", `%${filters.search}%`);
  }

  return query;
};