import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Heart, Star, Download, Share2, Users } from "lucide-react";
import { MetricCard } from "./metrics/MetricCard";
import { LoadingMetrics } from "./metrics/LoadingMetrics";
import { useMetricsQuery } from "./metrics/useMetricsQuery";
import { useEffect } from "react";
import { measureComponentPerformance } from "@/utils/performance";

export const DashboardMetrics = () => {
  const { data: metrics, isLoading, isError } = useMetricsQuery();

  useEffect(() => {
    const stopMeasuring = measureComponentPerformance('DashboardMetrics');
    return stopMeasuring;
  }, []);

  if (isError) {
    return (
      <Alert variant="destructive" className="mb-4" role="alert" aria-live="assertive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load dashboard metrics. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div 
      className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
      role="region"
      aria-label="Dashboard Metrics"
      aria-busy={isLoading}
    >
      {isLoading ? (
        <LoadingMetrics />
      ) : (
        <>
          <MetricCard 
            title="Total Visitors" 
            value={metrics?.visitors || 0}
            color="#22C55E"
            icon={<Users className="h-4 w-4 sm:h-5 sm:w-5" />}
            ariaLabel="Total number of visitors"
          />
          <MetricCard 
            title="Total Quotes" 
            value={metrics?.quotes || 0}
            color="#8B5CF6"
            ariaLabel="Total number of quotes"
          />
          <MetricCard 
            title="Total Authors" 
            value={metrics?.authors || 0}
            color="#D946EF"
            delay="150ms"
            ariaLabel="Total number of authors"
          />
          <MetricCard 
            title="Total Categories" 
            value={metrics?.categories || 0}
            color="#F97316"
            delay="300ms"
            ariaLabel="Total number of categories"
          />
          <MetricCard 
            title="Total Likes"
            value={metrics?.likes || 0}
            color="#F43F5E"
            delay="450ms"
            icon={<Heart className="h-4 w-4 sm:h-5 sm:w-5" />}
            ariaLabel="Total number of likes"
          />
          <MetricCard 
            title="Total Stars"
            value={metrics?.stars || 0}
            color="#EAB308"
            delay="600ms"
            icon={<Star className="h-4 w-4 sm:h-5 sm:w-5" />}
            ariaLabel="Total number of stars"
          />
          <MetricCard 
            title="Total Downloads"
            value={metrics?.downloads || 0}
            color="#0EA5E9"
            delay="750ms"
            icon={<Download className="h-4 w-4 sm:h-5 sm:w-5" />}
            ariaLabel="Total number of downloads"
          />
          <MetricCard 
            title="Total Shares"
            value={metrics?.shares || 0}
            color="#10B981"
            delay="900ms"
            icon={<Share2 className="h-4 w-4 sm:h-5 sm:w-5" />}
            ariaLabel="Total number of shares"
          />
        </>
      )}
    </div>
  );
};