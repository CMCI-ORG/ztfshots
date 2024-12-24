import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DOMPurify from 'dompurify';
import { User, UserRole } from "@/integrations/supabase/types/users";

const rateLimiter = {
  lastCall: 0,
  minInterval: 1000,
  canMakeCall() {
    const now = Date.now();
    if (now - this.lastCall >= this.minInterval) {
      this.lastCall = now;
      return true;
    }
    return false;
  }
};

export function useUsers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: users, error, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      if (!rateLimiter.canMakeCall()) {
        throw new Error("Too many requests. Please wait.");
      }

      console.log("Fetching users...");
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (usersError) {
        console.error("Error fetching users:", usersError);
        throw new Error(usersError.message);
      }

      if (!usersData) {
        console.warn("No users data returned");
        return [];
      }

      console.log("Successfully fetched users:", usersData.length);
      return usersData?.map(user => ({
        ...user,
        name: DOMPurify.sanitize(user.name),
        email: DOMPurify.sanitize(user.email),
      }));
    },
    retry: 3,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    meta: {
      errorHandler: (error: Error) => {
        console.error("Query error:", error);
        toast({
          title: "Error fetching users",
          description: error.message || "Please try again later",
          variant: "destructive",
        });
      }
    }
  });

  const updateUserRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      if (!rateLimiter.canMakeCall()) {
        throw new Error("Too many requests. Please wait.");
      }

      console.log("Updating user role:", { userId, role });
      const { error } = await supabase
        .from("users")
        .update({ role })
        .eq("id", userId);
      
      if (error) {
        console.error("Error updating user role:", error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Successfully updated user role");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    },
  });

  const deactivateUser = useMutation({
    mutationFn: async (id: string) => {
      if (!rateLimiter.canMakeCall()) {
        throw new Error("Too many requests. Please wait.");
      }

      console.log("Deactivating user:", id);
      const { error } = await supabase
        .from("users")
        .update({ status: "inactive" })
        .eq("id", id);
      
      if (error) {
        console.error("Error deactivating user:", error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Successfully deactivated user");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User deactivated successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to deactivate user",
        variant: "destructive",
      });
    },
  });

  return {
    users,
    error,
    isLoading,
    isError,
    updateUserRole: updateUserRole.mutate,
    deactivateUser: deactivateUser.mutate,
  };
}