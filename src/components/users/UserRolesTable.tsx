import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { UserTableHeader } from "./UserTableHeader";
import { UserTableRow } from "./UserTableRow";
import type { UserProfile, UserRole } from "@/types/users";

export function UserRolesTable() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [updating, setUpdating] = useState<string | null>(null);
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    userId: string;
    newRole: UserRole;
  } | null>(null);
  const queryClient = useQueryClient();

  const { data: currentUserProfile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, username, role, email")
        .returns<UserProfile[]>();

      if (error) throw error;
      return profiles;
    },
  });

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!currentUserProfile?.role || !["admin", "superadmin"].includes(currentUserProfile.role)) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to change user roles.",
        variant: "destructive",
      });
      return;
    }

    setPendingRoleChange({ userId, newRole });
  };

  const confirmRoleChange = async () => {
    if (!pendingRoleChange) return;

    try {
      setUpdating(pendingRoleChange.userId);
      const { error } = await supabase
        .from("profiles")
        .update({ role: pendingRoleChange.newRole })
        .eq("id", pendingRoleChange.userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
      setPendingRoleChange(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error instanceof Error ? error.message : "Failed to load users"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <UserTableHeader />
          <TableBody>
            {users?.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                onRoleChange={handleRoleChange}
                isUpdating={updating === user.id}
                currentUserRole={currentUserProfile?.role}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog 
        open={!!pendingRoleChange} 
        onOpenChange={() => setPendingRoleChange(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change this user's role? This action can be reversed later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}