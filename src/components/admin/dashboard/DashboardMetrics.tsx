import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Heart, Star, Download, Share2, Users, TrendingUp, ShoppingCart } from "lucide-react";
import { MetricCard } from "./metrics/MetricCard";
import { LoadingMetrics } from "./metrics/LoadingMetrics";
import { useMetricsQuery } from "./metrics/useMetricsQuery";

export const DashboardMetrics = () => {
  const { data: metrics, isLoading, isError } = useMetricsQuery();

  if (isError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load dashboard metrics. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {isLoading ? (
        <LoadingMetrics />
      ) : (
        <>
          <MetricCard 
            title="Total Sales" 
            value={metrics?.quotes || 0}
            color="#22d3ee"
            icon={<ShoppingCart className="h-5 w-5" />}
            trend="up"
          />
          <MetricCard 
            title="Revenue" 
            value={metrics?.authors || 0}
            color="#fb923c"
            icon={<TrendingUp className="h-5 w-5" />}
            trend="up"
            delay="150ms"
          />
          <MetricCard 
            title="New Customers" 
            value={metrics?.visitors || 0}
            color="#a855f7"
            icon={<Users className="h-5 w-5" />}
            trend="down"
            delay="300ms"
          />
          <MetricCard 
            title="Stock Items" 
            value={metrics?.categories || 0}
            color="#94a3b8"
            trend="down"
            delay="450ms"
          />
          <MetricCard 
            title="Total Likes"
            value={metrics?.likes || 0}
            color="#F43F5E"
            delay="600ms"
            icon={<Heart className="h-5 w-5" />}
          />
          <MetricCard 
            title="Total Stars"
            value={metrics?.stars || 0}
            color="#EAB308"
            delay="750ms"
            icon={<Star className="h-5 w-5" />}
          />
          <MetricCard 
            title="Total Downloads"
            value={metrics?.downloads || 0}
            color="#0EA5E9"
            delay="900ms"
            icon={<Download className="h-5 w-5" />}
          />
          <MetricCard 
            title="Total Shares"
            value={metrics?.shares || 0}
            color="#10B981"
            delay="1050ms"
            icon={<Share2 className="h-5 w-5" />}
          />
        </>
      )}
    </div>
  );
};