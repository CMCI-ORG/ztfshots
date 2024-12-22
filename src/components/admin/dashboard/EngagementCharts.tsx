import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export const EngagementCharts = memo(() => {
  const { data: userGrowth } = useQuery({
    queryKey: ["user-growth"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("created_at")
        .order("created_at");

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

  const { data: categoryEngagement } = useQuery({
    queryKey: ["category-engagement"],
    queryFn: async () => {
      const { data } = await supabase
        .from("quotes")
        .select(`
          categories:category_id(name),
          quote_likes(count)
        `);

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

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryEngagement}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="engagement" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
});

EngagementCharts.displayName = 'EngagementCharts';