import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NotificationTable } from "./components/NotificationTable";
import { NotificationActions } from "./components/NotificationActions";
import { useNotifications } from "./hooks/useNotifications";

export const NotificationManager = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: users, isLoading: isLoadingUsers, refetch } = useNotifications();

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
      const { data, error } = await supabase.functions.invoke('send-weekly-digest', {
        body: { 
          isTestMode: false,
          selectedUsers: selectedUsers
        }
      });

      if (error) {
        let errorMessage = "Failed to send digest.";
        
        // Enhanced error handling with specific messages
        if (error.message?.includes('rate limit')) {
          errorMessage = "Rate limit exceeded. The digest will be retried automatically.";
        } else if (error.message?.includes('verification')) {
          errorMessage = "Email verification issues detected. Please check subscriber status.";
        } else if (error.message?.includes('invalid email')) {
          errorMessage = "Invalid email addresses found. Please verify subscriber list.";
        }
        
        throw new Error(errorMessage);
      }

      if (data?.recipientCount > 0) {
        toast({
          title: "Success",
          description: `Digest sent successfully to ${data.recipientCount} users.${data.failureCount > 0 ? ` (${data.failureCount} failed)` : ''}`,
        });
      } else if (data?.failureCount > 0) {
        toast({
          title: "Warning",
          description: `Failed to send digest to ${data.failureCount} users. Retrying automatically.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Notice",
          description: data?.message || "No recipients processed",
          variant: "default",
        });
      }
      
      setSelectedUsers([]);
      await refetch();
    } catch (error: any) {
      console.error('Error sending digest:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send digest. Please try again.",
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