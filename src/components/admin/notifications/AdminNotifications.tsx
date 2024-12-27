import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { AlertCircle, AlertTriangle, BellRing, Info } from "lucide-react";

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
        return "bg-red-500 hover:bg-red-600";
      case "high":
        return "bg-orange-500 hover:bg-orange-600";
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-4 w-4" />;
      case "high":
        return <AlertTriangle className="h-4 w-4" />;
      case "medium":
        return <BellRing className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <BellRing className="h-5 w-5 text-gray-500" />
        <h2 className="text-lg font-semibold">System Notifications</h2>
      </div>
      <ScrollArea className="h-[400px] rounded-md border shadow-sm bg-white p-4">
        <div className="space-y-2">
          {notifications?.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <Badge 
                className={`${getSeverityColor(notification.severity)} flex items-center gap-1`}
              >
                {getSeverityIcon(notification.severity)}
                {notification.severity}
              </Badge>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{notification.message}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(notification.created_at), "PPp")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};