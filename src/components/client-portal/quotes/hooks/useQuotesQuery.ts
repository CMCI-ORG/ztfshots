import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuoteFilters } from "../../SearchFilterPanel";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears, subWeeks } from "date-fns";

export const useQuotesQuery = (
  filters: QuoteFilters | undefined,
  currentPage: number,
  itemsPerPage: number,
  showScheduled = false
) => {
  return useQuery({
    queryKey: ["quotes", filters, currentPage, showScheduled],
    queryFn: async () => {
      let query = supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id(name, image_url),
          categories:category_id(name)
        `, { count: 'exact' })
        .order("post_date", { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      // Only show live quotes in client portal
      if (!showScheduled) {
        query = query.eq('status', 'live');
      }

      if (filters?.authorId && filters.authorId !== "all") {
        query = query.eq("author_id", filters.authorId);
      }

      if (filters?.categoryId && filters.categoryId !== "all") {
        query = query.eq("category_id", filters.categoryId);
      }

      if (filters?.timeRange && filters.timeRange !== "lifetime") {
        const now = new Date();
        let startDate, endDate;

        switch (filters.timeRange) {
          case "this_week":
            startDate = startOfWeek(now);
            endDate = endOfWeek(now);
            break;
          case "last_week":
            startDate = startOfWeek(subWeeks(now, 1));
            endDate = endOfWeek(subWeeks(now, 1));
            break;
          case "this_month":
            startDate = startOfMonth(now);
            endDate = endOfMonth(now);
            break;
          case "last_month":
            startDate = startOfMonth(subMonths(now, 1));
            endDate = endOfMonth(subMonths(now, 1));
            break;
          case "this_year":
            startDate = startOfYear(now);
            endDate = endOfYear(now);
            break;
          case "last_year":
            startDate = startOfYear(subYears(now, 1));
            endDate = endOfYear(subYears(now, 1));
            break;
        }

        if (startDate && endDate) {
          query = query
            .gte("post_date", startDate.toISOString())
            .lte("post_date", endDate.toISOString());
        }
      }

      if (filters?.search) {
        // Fix: Use textSearch for proper OR condition
        query = query.or(`text.ilike.%${filters.search}%,categories->>name.ilike.%${filters.search}%`);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { data, count };
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
};