import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardMetrics {
  visitors: number;
  quotes: number;
  authors: number;
  categories: number;
  likes: number;
  stars: number;
  downloads: number;
  shares: number;
  notifications: {
    total: number;
    successful: number;
    failed: number;
    retries: number;
  };
}

export const useMetricsQuery = () => {
  return useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      // Fetch all required metrics in parallel
      const [
        visitorCount,
        quoteCount,
        authorCount,
        categoryCount,
        likeCount,
        starCount,
        downloadCount,
        shareCount,
        notificationMetrics
      ] = await Promise.all([
        supabase.from('visitor_analytics').select('*', { count: 'exact', head: true }),
        supabase.from('quotes').select('*', { count: 'exact', head: true }),
        supabase.from('authors').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('quote_likes').select('*', { count: 'exact', head: true }),
        supabase.from('quote_stars').select('*', { count: 'exact', head: true }),
        supabase.from('quote_downloads').select('*', { count: 'exact', head: true }),
        supabase.from('quote_shares').select('*', { count: 'exact', head: true }),
        supabase.from('notification_metrics')
          .select('*')
          .order('date', { ascending: false })
          .limit(30)
      ]);

      if (visitorCount.error) throw visitorCount.error;
      if (quoteCount.error) throw quoteCount.error;
      if (authorCount.error) throw authorCount.error;
      if (categoryCount.error) throw categoryCount.error;
      if (likeCount.error) throw likeCount.error;
      if (starCount.error) throw starCount.error;
      if (downloadCount.error) throw downloadCount.error;
      if (shareCount.error) throw shareCount.error;
      if (notificationMetrics.error) throw notificationMetrics.error;

      // Calculate notification metrics
      const latestMetrics = notificationMetrics.data?.[0] || {
        total_sent: 0,
        successful_delivery: 0,
        failed_delivery: 0,
        retry_attempts: 0
      };

      return {
        visitors: visitorCount.count || 0,
        quotes: quoteCount.count || 0,
        authors: authorCount.count || 0,
        categories: categoryCount.count || 0,
        likes: likeCount.count || 0,
        stars: starCount.count || 0,
        downloads: downloadCount.count || 0,
        shares: shareCount.count || 0,
        notifications: {
          total: latestMetrics.total_sent,
          successful: latestMetrics.successful_delivery,
          failed: latestMetrics.failed_delivery,
          retries: latestMetrics.retry_attempts
        }
      };
    }
  });
};