import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const NotificationManager = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSelectAll = async () => {
    const { data: users } = await supabase
      .from("users")
      .select("id")
      .eq("status", "active")
      .eq("email_status", "verified");

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
            {/* We'll populate this with real data in the next step */}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};