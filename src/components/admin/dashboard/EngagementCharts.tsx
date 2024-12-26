import { memo, useState, useEffect } from "react";
import { UserGrowthChart } from "./charts/UserGrowthChart";
import { CategoryEngagementChart } from "./charts/CategoryEngagementChart";
import { useEngagementQueries } from "./charts/useEngagementQueries";
import { TimeRangeFilter, TimeRange } from "./filters/TimeRangeFilter";
import { measureComponentPerformance } from "@/utils/performance";

export const EngagementCharts = memo(() => {
  const [timeRange, setTimeRange] = useState<TimeRange>('lifetime');
  
  const { 
    userGrowthQuery: { data: userGrowth, isLoading: isLoadingGrowth, isError: isGrowthError },
    categoryEngagementQuery: { data: categoryEngagement, isLoading: isLoadingEngagement, isError: isEngagementError }
  } = useEngagementQueries(timeRange);

  useEffect(() => {
    const stopMeasuring = measureComponentPerformance('EngagementCharts');
    return stopMeasuring;
  }, []);

  return (
    <div 
      className="space-y-4"
      role="region"
      aria-label="Engagement Analytics"
    >
      <div className="flex justify-end">
        <TimeRangeFilter 
          value={timeRange} 
          onChange={setTimeRange}
          aria-label="Select time range for analytics"
        />
      </div>
      <div 
        className="grid gap-4 md:grid-cols-2"
        aria-busy={isLoadingGrowth || isLoadingEngagement}
      >
        <UserGrowthChart 
          data={userGrowth || []}
          isLoading={isLoadingGrowth}
          isError={isGrowthError}
        />
        <CategoryEngagementChart 
          data={categoryEngagement || []}
          isLoading={isLoadingEngagement}
          isError={isEngagementError}
        />
      </div>
    </div>
  );
});

EngagementCharts.displayName = 'EngagementCharts';