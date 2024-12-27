import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const NotificationManager = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["notification-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select(`
          id,
          name,
          email,
          status,
          email_status,
          created_at,
          (
            SELECT sent_at 
            FROM email_notifications 
            WHERE subscriber_id = users.id 
            ORDER BY sent_at DESC 
            LIMIT 1
          ) as last_notification
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const handleSelectAll = () => {
    if (users) {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedUsers([]);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSendDigest = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to send the digest to.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-weekly-digest', {
        body: { 
          isTestMode: false,
          selectedUsers: selectedUsers
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Digest sent to ${selectedUsers.length} users.`,
      });
      
      // Clear selection after successful send
      setSelectedUsers([]);
    } catch (error: any) {
      console.error('Error sending digest:', error);
      toast({
        title: "Error",
        description: "Failed to send digest. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Notification Manager</h2>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={handleSelectAll}
            disabled={isLoading}
          >
            Select All
          </Button>
          <Button 
            variant="outline" 
            onClick={handleClearSelection}
            disabled={isLoading}
          >
            Clear Selection
          </Button>
          <Button 
            onClick={handleSendDigest}
            disabled={isLoading || selectedUsers.length === 0}
          >
            {isLoading ? "Sending..." : "Send Digest"}
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Select</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Notification</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingUsers ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading subscribers...
                </TableCell>
              </TableRow>
            ) : users?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No subscribers found
                </TableCell>
              </TableRow>
            ) : (
              users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleUserSelect(user.id)}
                      disabled={isLoading}
                    />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.email_status === "verified" ? "success" : "secondary"}>
                      {user.email_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.last_notification ? (
                      format(new Date(user.last_notification), "PPp")
                    ) : (
                      "Never"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};