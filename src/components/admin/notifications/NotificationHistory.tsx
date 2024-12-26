import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/utils/analytics";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const NotificationHistory = () => {
  const { toast } = useToast();

  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ["notifications-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_notifications")
        .select(`
          id,
          type,
          sent_at,
          status,
          subscriber_id,
          quote_id,
          digest_id,
          whatsapp_status
        `)
        .order("sent_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Track view event
      await trackEvent("view_notification_history");

      return data || [];
    },
  });

  if (error) {
    toast({
      title: "Error loading notifications",
      description: "Failed to load notification history. Please try again.",
      variant: "destructive",
    });
    return null;
  }

  if (isLoading) {
    return <div>Loading notification history...</div>;
  }

  const getStatusBadge = (status: string) => {
    const variant = status === "sent" ? "success" : "destructive";
    return <Badge variant={variant}>{status}</Badge>;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Sent At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>WhatsApp Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.map((notification) => (
            <TableRow key={notification.id}>
              <TableCell className="font-medium">{notification.type}</TableCell>
              <TableCell>
                {format(new Date(notification.sent_at), "PPp")}
              </TableCell>
              <TableCell>{getStatusBadge(notification.status)}</TableCell>
              <TableCell>
                {notification.whatsapp_status && 
                  getStatusBadge(notification.whatsapp_status)
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};