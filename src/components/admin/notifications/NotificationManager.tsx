import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NotificationTable } from "./components/NotificationTable";
import { NotificationActions } from "./components/NotificationActions";
import { useNotifications } from "./hooks/useNotifications";

export const NotificationManager = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: users, isLoading: isLoadingUsers } = useNotifications();

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
        <NotificationActions
          onSelectAll={handleSelectAll}
          onClearSelection={handleClearSelection}
          onSendDigest={handleSendDigest}
          isLoading={isLoading}
          selectedCount={selectedUsers.length}
        />
      </div>

      <NotificationTable
        users={users}
        selectedUsers={selectedUsers}
        isLoading={isLoadingUsers}
        onUserSelect={handleUserSelect}
      />
    </Card>
  );
};