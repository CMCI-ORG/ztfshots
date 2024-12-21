import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "recharts";

const categoryData = [
  { name: "Inspiration", value: 45 },
  { name: "Philosophy", value: 30 },
  { name: "Life", value: 25 },
];

const timelineData = [
  { month: "Jan", quotes: 20 },
  { month: "Feb", quotes: 35 },
  { month: "Mar", quotes: 25 },
  { month: "Apr", quotes: 40 },
];

const authorData = [
  { author: "Marcus Aurelius", quotes: 15 },
  { author: "Maya Angelou", quotes: 12 },
  { author: "Oscar Wilde", quotes: 10 },
];

export const QuoteStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Categories Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart width={300} height={200} data={categoryData}>
            <pie dataKey="value" nameKey="name" />
          </PieChart>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Quotes Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart width={300} height={200} data={timelineData}>
            <line type="monotone" dataKey="quotes" stroke="#9b87f5" />
          </LineChart>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Authors</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart width={300} height={200} data={authorData}>
            <bar dataKey="quotes" fill="#7E69AB" />
          </BarChart>
        </CardContent>
      </Card>
    </div>
  );
};