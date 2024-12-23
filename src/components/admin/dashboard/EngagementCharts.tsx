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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const EngagementCharts = memo(() => {
  const { toast } = useToast();

  const { data: userGrowth, isLoading: isLoadingGrowth, isError: isGrowthError } = useQuery({
    queryKey: ["user-growth"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("created_at")
        .order("created_at");

      if (error) {
        console.error("Error fetching user growth:", error);
        toast({
          title: "Error loading user growth data",
          description: "Please try again later",
          variant: "destructive",
        });
        throw error;
      }

      if (!data) return [];

      const monthlyData = data.reduce((acc: any[], profile) => {
        const month = new Date(profile.created_at).toLocaleString('default', { month: 'short' });
        const existingMonth = acc.find(item => item.month === month);
        
        if (existingMonth) {
          existingMonth.users += 1;
        } else {
          acc.push({ month, users: 1 });
        }
        
        return acc;
      }, []);

      return monthlyData;
    }
  });

  const { data: categoryEngagement, isLoading: isLoadingEngagement, isError: isEngagementError } = useQuery({
    queryKey: ["category-engagement"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          categories:category_id(name),
          quote_likes(count)
        `);

      if (error) {
        console.error("Error fetching category engagement:", error);
        toast({
          title: "Error loading engagement data",
          description: "Please try again later",
          variant: "destructive",
        });
        throw error;
      }

      if (!data) return [];

      const engagementData = data.reduce((acc: any[], quote) => {
        const category = quote.categories?.name;
        const existingCategory = acc.find(item => item.category === category);
        
        if (existingCategory) {
          existingCategory.engagement += quote.quote_likes.length;
        } else if (category) {
          acc.push({ category, engagement: quote.quote_likes.length });
        }
        
        return acc;
      }, []);

      return engagementData;
    }
  });

  const renderChart = (isLoading: boolean, isError: boolean, content: React.ReactNode) => {
    if (isLoading) {
      return <Skeleton className="w-full h-[300px]" />;
    }

    if (isError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load chart data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      );
    }

    return content;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          {renderChart(
            isLoadingGrowth,
            isGrowthError,
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowth}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#8884d8"
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          {renderChart(
            isLoadingEngagement,
            isEngagementError,
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryEngagement}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="engagement" 
                  fill="#8884d8"
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

EngagementCharts.displayName = 'EngagementCharts';