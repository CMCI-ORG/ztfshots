import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "./ChartContainer";

interface CategoryEngagementChartProps {
  data: Array<{ category: string; engagement: number }>;
  isLoading: boolean;
  isError: boolean;
}

export const CategoryEngagementChart = ({ data, isLoading, isError }: CategoryEngagementChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Engagement</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer isLoading={isLoading} isError={isError}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
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
        </ChartContainer>
      </CardContent>
    </Card>
  );
};