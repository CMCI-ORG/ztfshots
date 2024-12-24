import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export const SubscriberAnalytics = () => {
  const { data: subscriberGrowth, isLoading: isLoadingGrowth } = useQuery({
    queryKey: ["subscriber-growth"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("created_at")
        .order("created_at");

      if (error) throw error;
      if (!data) return [];

      const monthlyData = data.reduce((acc: any[], subscriber) => {
        const month = new Date(subscriber.created_at).toLocaleString('default', { month: 'short' });
        const existingMonth = acc.find(item => item.month === month);
        
        if (existingMonth) {
          existingMonth.subscribers += 1;
        } else {
          acc.push({ month, subscribers: 1 });
        }
        
        return acc;
      }, []);

      return monthlyData;
    }
  });

  const { data: notificationStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["notification-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_notifications")
        .select(`
          type,
          status
        `);

      if (error) throw error;
      if (!data) return [];

      const stats = data.reduce((acc: any, notification) => {
        const key = `${notification.type}_${notification.status}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      return [
        { name: 'Quote Notifications', sent: stats.quote_sent || 0, failed: stats.quote_failed || 0 },
        { name: 'Weekly Digests', sent: stats.digest_sent || 0, failed: stats.digest_failed || 0 }
      ];
    }
  });

  if (isLoadingGrowth || isLoadingStats) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="h-[300px] flex items-center justify-center">
            Loading subscriber growth data...
          </div>
        </Card>
        <Card className="p-6">
          <div className="h-[300px] flex items-center justify-center">
            Loading notification stats...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Subscriber Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={subscriberGrowth}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="subscribers" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Email Notification Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={notificationStats}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sent" fill="#4ade80" name="Sent" />
            <Bar dataKey="failed" fill="#f87171" name="Failed" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};