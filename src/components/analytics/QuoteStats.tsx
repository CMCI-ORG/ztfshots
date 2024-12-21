import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, LineChart, Line, BarChart, Bar, Tooltip, XAxis, YAxis } from "recharts";

const categoryData = [
  { name: "Faith & Trust", value: 30 },
  { name: "Prayer & Intercession", value: 25 },
  { name: "Holiness & Purity", value: 20 },
  { name: "Leadership & Discipleship", value: 15 },
  { name: "Christian Service", value: 10 },
];

const timelineData = [
  { month: "Jan", quotes: 20 },
  { month: "Feb", quotes: 35 },
  { month: "Mar", quotes: 25 },
  { month: "Apr", quotes: 40 },
];

const authorData = [
  { author: "Charles Spurgeon", quotes: 15 },
  { author: "A.W. Tozer", quotes: 12 },
  { author: "Andrew Murray", quotes: 10 },
];

export const QuoteStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Themes Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart width={300} height={200}>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#9b87f5"
            />
            <Tooltip />
          </PieChart>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Quotes Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart width={300} height={200} data={timelineData}>
            <Line type="monotone" dataKey="quotes" stroke="#9b87f5" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Authors</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart width={300} height={200} data={authorData}>
            <Bar dataKey="quotes" fill="#7E69AB" />
            <XAxis dataKey="author" />
            <YAxis />
            <Tooltip />
          </BarChart>
        </CardContent>
      </Card>
    </div>
  );
};