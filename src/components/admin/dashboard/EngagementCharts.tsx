import { memo, useState } from "react";
import { UserGrowthChart } from "./charts/UserGrowthChart";
import { CategoryEngagementChart } from "./charts/CategoryEngagementChart";
import { useEngagementQueries } from "./charts/useEngagementQueries";
import { TimeRangeFilter, TimeRange } from "./filters/TimeRangeFilter";

export const EngagementCharts = memo(() => {
  const [timeRange, setTimeRange] = useState<TimeRange>('lifetime');
  
  const { 
    userGrowthQuery: { data: userGrowth, isLoading: isLoadingGrowth, isError: isGrowthError },
    categoryEngagementQuery: { data: categoryEngagement, isLoading: isLoadingEngagement, isError: isEngagementError }
  } = useEngagementQueries(timeRange);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <TimeRangeFilter value={timeRange} onChange={setTimeRange} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
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