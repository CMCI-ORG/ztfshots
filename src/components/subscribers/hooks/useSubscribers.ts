import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DOMPurify from 'dompurify';
import { Subscriber } from "@/integrations/supabase/types/users";

// Rate limiting helper
const rateLimiter = {
  lastCall: 0,
  minInterval: 1000, // 1 second between calls
  canMakeCall() {
    const now = Date.now();
    if (now - this.lastCall >= this.minInterval) {
      this.lastCall = now;
      return true;
    }
    return false;
  }
};

export function useSubscribers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: subscribers, error, isLoading, isError } = useQuery({
    queryKey: ["subscribers"],
    queryFn: async () => {
      if (!rateLimiter.canMakeCall()) {
        throw new Error("Too many requests. Please wait.");
      }

      console.log("Fetching subscribers...");
      const { data: subscribersData, error: subscribersError } = await supabase
        .from("subscribers")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (subscribersError) {
        console.error("Error fetching subscribers:", subscribersError);
        throw new Error(subscribersError.message);
      }

      if (!subscribersData) {
        console.warn("No subscribers data returned");
        return [];
      }

      console.log("Successfully fetched subscribers:", subscribersData.length);
      return subscribersData?.map(subscriber => ({
        ...subscriber,
        name: DOMPurify.sanitize(subscriber.name),
        email: DOMPurify.sanitize(subscriber.email),
        role: 'subscriber' // Default role for subscribers
      }));
    },
    retry: 3,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
    meta: {
      errorHandler: (error: Error) => {
        console.error("Query error:", error);
        toast({
          title: "Error fetching subscribers",
          description: error.message || "Please try again later",
          variant: "destructive",
        });
      }
    }
  });

  const deactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!rateLimiter.canMakeCall()) {
        throw new Error("Too many requests. Please wait.");
      }

      console.log("Deactivating subscriber:", id);
      const { error } = await supabase
        .from("subscribers")
        .update({ status: "inactive" })
        .eq("id", id);
      
      if (error) {
        console.error("Error deactivating subscriber:", error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Successfully deactivated subscriber");
      queryClient.invalidateQueries({ queryKey: ["subscribers"] });
      toast({
        title: "Success",
        description: "Subscriber deactivated successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to deactivate subscriber",
        variant: "destructive",
      });
    },
  });

  return {
    subscribers,
    error,
    isLoading,
    isError,
    deactivateSubscriber: deactivateMutation.mutate,
  };
}