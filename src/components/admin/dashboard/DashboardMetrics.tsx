import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { format } from "date-fns";

export const DashboardMetrics = () => {
  const { data: metrics } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      
      const [totalQuotes, lastMonthQuotes, totalSubscribers, totalEngagements] = await Promise.all([
        supabase.from("quotes").select("*", { count: "exact" }),
        supabase.from("quotes")
          .select("*", { count: "exact" })
          .lt("created_at", format(today, "yyyy-MM-dd"))
          .gt("created_at", format(lastMonth, "yyyy-MM-dd")),
        supabase.from("subscribers").select("*", { count: "exact" }),
        supabase.from("quote_likes").select("*", { count: "exact" })
      ]);

      const currentQuotesCount = totalQuotes.count || 0;
      const lastMonthQuotesCount = lastMonthQuotes.count || 0;
      const percentageChange = ((currentQuotesCount - lastMonthQuotesCount) / lastMonthQuotesCount) * 100;

      return {
        totalQuotes: currentQuotesCount,
        percentageChange,
        totalSubscribers: totalSubscribers.count || 0,
        totalEngagements: totalEngagements.count || 0
      };
    }
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
          <div className="flex items-center space-x-1">
            {metrics?.percentageChange > 0 ? (
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            )}
            <span className={metrics?.percentageChange > 0 ? "text-green-500" : "text-red-500"}>
              {Math.abs(metrics?.percentageChange || 0).toFixed(1)}%
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.totalQuotes || 0}</div>
          <p className="text-xs text-muted-foreground">from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.totalSubscribers || 0}</div>
          <p className="text-xs text-muted-foreground">Total subscribers</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Engagements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.totalEngagements || 0}</div>
          <p className="text-xs text-muted-foreground">Likes, shares, and downloads</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Featured Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Coming Soon</div>
          <p className="text-xs text-muted-foreground">Featured quotes system</p>
        </CardContent>
      </Card>
    </div>
  );
};