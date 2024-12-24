import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ChartContainer } from "../charts/ChartContainer";
import { supabase } from "@/integrations/supabase/client";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface DemographicData {
  device_type: string;
  os: string;
  browser: string;
  language: string;
  visit_count: number;
  unique_visitors: number;
}

const createChartData = (data: any[], key: string) => {
  const counts: Record<string, number> = {};
  
  data.forEach(item => {
    const value = item[key] || 'Unknown';
    counts[value] = (counts[value] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Only show top 5 for cleaner visualization
};

const PieChartCard = ({ 
  data, 
  title, 
  dataKey 
}: { 
  data: any[]; 
  title: string; 
  dataKey: string;
}) => {
  const chartData = createChartData(data, dataKey);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => 
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const DemographicCharts = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["visitor-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visitor_analytics")
        .select("*");

      if (error) throw error;
      return data || [];
    },
  });

  return (
    <ChartContainer isLoading={isLoading} isError={isError}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PieChartCard 
          data={data || []} 
          title="Device Types" 
          dataKey="device_type" 
        />
        <PieChartCard 
          data={data || []} 
          title="Browsers" 
          dataKey="browser" 
        />
        <PieChartCard 
          data={data || []} 
          title="Operating Systems" 
          dataKey="os" 
        />
        <PieChartCard 
          data={data || []} 
          title="Languages" 
          dataKey="language" 
        />
      </div>
    </ChartContainer>
  );
};