import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "./ChartContainer";

interface UserGrowthChartProps {
  data: Array<{ month: string; users: number }>;
  isLoading: boolean;
  isError: boolean;
}

export const UserGrowthChart = ({ data, isLoading, isError }: UserGrowthChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer isLoading={isLoading} isError={isError}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
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
        </ChartContainer>
      </CardContent>
    </Card>
  );
};