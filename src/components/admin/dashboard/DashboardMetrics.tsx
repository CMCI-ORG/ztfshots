/**
 * DashboardMetrics Component
 * 
 * Displays key metrics for the admin dashboard including total counts for quotes,
 * authors, and categories. Features loading states and animations.
 * 
 * @component
 * @example
 * ```tsx
 * <DashboardMetrics />
 * ```
 */
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {isLoading ? (
        <LoadingMetrics />
      ) : (
        <>
          <MetricCard 
            title="Total Quotes" 
            value={metrics?.quotes || 0} 
          />
          <MetricCard 
            title="Total Authors" 
            value={metrics?.authors || 0} 
            delay="150ms"
          />
          <MetricCard 
            title="Total Categories" 
            value={metrics?.categories || 0} 
            delay="300ms"
          />
        </>
      )}
    </div>
  );
};