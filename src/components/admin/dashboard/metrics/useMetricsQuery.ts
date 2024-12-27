import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMetricsQuery = () => {
  return useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const [metricsResponse, notificationsResponse] = await Promise.all([
        supabase
          .from("notification_metrics")
          .select("*")
          .order("date", { ascending: false })
          .limit(30),
        supabase
          .from("email_notifications")
          .select("status", { count: "exact" })
          .in("status", ["sent", "failed"])
          .gt("sent_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      if (metricsResponse.error) throw metricsResponse.error;
      if (notificationsResponse.error) throw notificationsResponse.error;

      const totalNotifications = notificationsResponse.count || 0;
      const successRate = totalNotifications ? 
        (notificationsResponse.data.filter(n => n.status === "sent").length / totalNotifications) * 100 : 
        0;

      return {
        metrics: metricsResponse.data || [],
        totalNotifications,
        successRate
      };
    }
  });
};