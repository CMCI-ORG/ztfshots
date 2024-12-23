/**
 * EngagementCharts Component
 * 
 * Displays interactive charts showing user growth and category engagement metrics.
 * Uses Recharts for visualization and React Query for data fetching.
 * 
 * @component
 * @example
 * ```tsx
 * <EngagementCharts />
 * ```
 */
import { memo } from "react";
import { UserGrowthChart } from "./charts/UserGrowthChart";
import { CategoryEngagementChart } from "./charts/CategoryEngagementChart";
import { useEngagementQueries } from "./charts/useEngagementQueries";

export const EngagementCharts = memo(() => {
  const { 
    userGrowthQuery: { data: userGrowth, isLoading: isLoadingGrowth, isError: isGrowthError },
    categoryEngagementQuery: { data: categoryEngagement, isLoading: isLoadingEngagement, isError: isEngagementError }
  } = useEngagementQueries();

  return (
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
  );
});

EngagementCharts.displayName = 'EngagementCharts';