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
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardMetrics = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const [quotesCount, authorsCount, categoriesCount] = await Promise.all([
        supabase.from("quotes").select("*", { count: "exact", head: true }),
        supabase.from("authors").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true }),
      ]);

      return {
        quotes: quotesCount.count || 0,
        authors: authorsCount.count || 0,
        categories: categoriesCount.count || 0,
      };
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {isLoading ? (
        <>
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-12 w-16" />
            </Card>
          ))}
        </>
      ) : (
        <>
          <Card className="p-6 transform hover:scale-105 transition-all duration-300 animate-fade-in">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Total Quotes
            </h3>
            <p className="text-3xl font-bold">{metrics?.quotes}</p>
          </Card>
          <Card className="p-6 transform hover:scale-105 transition-all duration-300 animate-fade-in [animation-delay:150ms]">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Total Authors
            </h3>
            <p className="text-3xl font-bold">{metrics?.authors}</p>
          </Card>
          <Card className="p-6 transform hover:scale-105 transition-all duration-300 animate-fade-in [animation-delay:300ms]">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Total Categories
            </h3>
            <p className="text-3xl font-bold">{metrics?.categories}</p>
          </Card>
        </>
      )}
    </div>
  );
};