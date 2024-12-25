import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuoteFilters } from "../../SearchFilterPanel";
import { getTimeRangeFilter } from "./utils/timeRangeFilter";

export const useQuotesQuery = (
  filters: QuoteFilters = {
    search: "",
    authorId: "",
    categoryId: "",
    sourceId: "",
    timeRange: "lifetime"
  },
  currentPage = 1,
  itemsPerPage = 12,
  showScheduled = false
) => {
  const {
    search,
    authorId,
    categoryId,
    sourceId,
    timeRange,
  } = filters;

  return useQuery({
    queryKey: ["quotes", filters, currentPage, itemsPerPage, showScheduled],
    queryFn: async () => {
      let query = supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id (name, image_url),
          categories:category_id (name),
          sources:source_id (title)
        `)
        .eq("status", showScheduled ? "scheduled" : "live")
        .order("post_date", { ascending: false });

      if (search) {
        query = query.ilike("text", `%${search}%`);
      }

      if (authorId && authorId !== "all") {
        query = query.eq("author_id", authorId);
      }

      if (categoryId && categoryId !== "all") {
        query = query.eq("category_id", categoryId);
      }

      if (sourceId && sourceId !== "all") {
        query = query.eq("source_id", sourceId);
      }

      if (timeRange && timeRange !== "lifetime") {
        const timeRangeFilter = getTimeRangeFilter(timeRange);
        if (timeRangeFilter) {
          query = query.gte("post_date", timeRangeFilter);
        }
      }

      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;

      const { data, error, count } = await query
        .range(start, end)
        .order("post_date", { ascending: false });

      if (error) throw error;

      return {
        data,
        count,
      };
    },
  });
};