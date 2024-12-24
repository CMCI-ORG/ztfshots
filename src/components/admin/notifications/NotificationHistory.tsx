import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function NotificationHistory() {
  const [filter, setFilter] = useState<string>("all");

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications-history", filter],
    queryFn: async () => {
      const query = supabase
        .from("email_notifications")
        .select(`
          *,
          quotes (text),
          users (email, name),
          weekly_digests (start_date, end_date)
        `)
        .order("sent_at", { ascending: false });

      if (filter !== "all") {
        query.eq("type", filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Notifications</SelectItem>
            <SelectItem value="quote">Quote Notifications</SelectItem>
            <SelectItem value="digest">Weekly Digests</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Recipient</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sent At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications?.map((notification) => (
            <TableRow key={notification.id}>
              <TableCell>
                <Badge variant={notification.type === "quote" ? "default" : "secondary"}>
                  {notification.type === "quote" ? "Quote" : "Digest"}
                </Badge>
              </TableCell>
              <TableCell>
                {notification.users?.name} ({notification.users?.email})
              </TableCell>
              <TableCell className="max-w-md truncate">
                {notification.type === "quote"
                  ? notification.quotes?.text
                  : `Weekly Digest ${format(
                      new Date(notification.weekly_digests?.start_date || ""),
                      "MMM d"
                    )} - ${format(
                      new Date(notification.weekly_digests?.end_date || ""),
                      "MMM d, yyyy"
                    )}`}
              </TableCell>
              <TableCell>
                <Badge
                  variant={notification.status === "sent" ? "success" : "destructive"}
                >
                  {notification.status}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(notification.sent_at), "MMM d, yyyy HH:mm")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
