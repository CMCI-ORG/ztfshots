import { Card } from "@/components/ui/card";
import { useMetricsQuery } from "../dashboard/metrics/useMetricsQuery";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const NotificationDashboard = () => {
  const { data, isLoading, error } = useMetricsQuery();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <Skeleton className="h-[300px]" />
        </Card>
        <Card className="p-6">
          <Skeleton className="h-[300px]" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load notification metrics. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Notifications</h3>
          <p className="text-2xl font-bold">{data?.totalNotifications.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
          <p className="text-2xl font-bold">{data?.successRate.toFixed(1)}%</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Retry Rate</h3>
          <p className="text-2xl font-bold">
            {((data?.metrics[0]?.retry_attempts || 0) / (data?.totalNotifications || 1) * 100).toFixed(1)}%
          </p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Delivery Success Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data?.metrics}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="successful_delivery" 
                stroke="#4ade80" 
                name="Successful"
              />
              <Line 
                type="monotone" 
                dataKey="failed_delivery" 
                stroke="#f87171" 
                name="Failed"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Retry Attempts</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.metrics}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="retry_attempts" fill="#8b5cf6" name="Retries" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};