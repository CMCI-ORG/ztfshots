import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears } from "date-fns";
import type { TimeRange } from "../filters/TimeRangeFilter";

const getTimeRangeFilter = (timeRange: TimeRange) => {
  const now = new Date();
  switch (timeRange) {
    case 'this_week':
      return { start: startOfWeek(now), end: endOfWeek(now) };
    case 'this_month':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'last_month':
      return { start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1)) };
    case 'this_year':
      return { start: startOfYear(now), end: endOfYear(now) };
    case 'last_year':
      return { start: startOfYear(subYears(now, 1)), end: endOfYear(subYears(now, 1)) };
    case 'lifetime':
      return null;
  }
};

export const useEngagementQueries = (timeRange: TimeRange = 'this_week') => {
  const timeFilter = getTimeRangeFilter(timeRange);

  const userGrowthQuery = useQuery({
    queryKey: ['user-growth', timeRange],
    queryFn: async () => {
      let query = supabase
        .from('users')
        .select('created_at')
        .order('created_at');

      if (timeFilter) {
        query = query
          .gte('created_at', timeFilter.start.toISOString())
          .lte('created_at', timeFilter.end.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      // Process data to group by month
      const monthlyData = (data || []).reduce((acc: any[], user: any) => {
        const month = new Date(user.created_at).toLocaleString('default', { month: 'short' });
        const existingMonth = acc.find(item => item.month === month);
        if (existingMonth) {
          existingMonth.users += 1;
        } else {
          acc.push({ month, users: 1 });
        }
        return acc;
      }, []);

      return monthlyData;
    }
  });

  const categoryEngagementQuery = useQuery({
    queryKey: ['category-engagement', timeRange],
    queryFn: async () => {
      let query = supabase
        .from('quotes')
        .select(`
          category_id,
          categories!inner(name),
          quote_likes(count),
          quote_shares(count),
          quote_stars(count)
        `);

      if (timeFilter) {
        query = query
          .gte('created_at', timeFilter.start.toISOString())
          .lte('created_at', timeFilter.end.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      // Process data to calculate engagement per category
      const categoryData = (data || []).reduce((acc: any[], quote: any) => {
        const categoryName = quote.categories.name;
        const existingCategory = acc.find(item => item.category === categoryName);
        const engagement = 
          (quote.quote_likes?.length || 0) + 
          (quote.quote_shares?.length || 0) + 
          (quote.quote_stars?.length || 0);

        if (existingCategory) {
          existingCategory.engagement += engagement;
        } else {
          acc.push({ category: categoryName, engagement });
        }
        return acc;
      }, []);

      return categoryData.sort((a: any, b: any) => b.engagement - a.engagement);
    }
  });

  return {
    userGrowthQuery,
    categoryEngagementQuery
  };
};