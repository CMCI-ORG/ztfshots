import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

export const AdminNotifications = () => {
  const { data: notifications } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">System Notifications</h2>
      <ScrollArea className="h-[400px] rounded-md border p-4">
        {notifications?.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg"
          >
            <Badge className={getSeverityColor(notification.severity)}>
              {notification.severity}
            </Badge>
            <div className="flex-1">
              <p className="font-medium">{notification.message}</p>
              <p className="text-sm text-gray-500">
                {format(new Date(notification.created_at), "PPp")}
              </p>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};