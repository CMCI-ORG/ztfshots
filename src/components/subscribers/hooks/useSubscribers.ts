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

  const { data: subscribers, error, isLoading } = useQuery({
    queryKey: ["subscribers"],
    queryFn: async () => {
      if (!rateLimiter.canMakeCall()) {
        throw new Error("Too many requests. Please wait.");
      }

      const { data, error } = await supabase
        .from("subscribers")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching subscribers:", error);
        throw new Error("Failed to fetch subscribers");
      }

      return data?.map(subscriber => ({
        ...subscriber,
        name: DOMPurify.sanitize(subscriber.name),
        email: DOMPurify.sanitize(subscriber.email)
      }));
    },
    retry: 3,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
  });

  const deactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!rateLimiter.canMakeCall()) {
        throw new Error("Too many requests. Please wait.");
      }

      const { error } = await supabase
        .from("subscribers")
        .update({ status: "inactive" })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribers"] });
      toast({
        title: "Success",
        description: "Subscriber deactivated successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Error deactivating subscriber:", error);
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
    deactivateSubscriber: deactivateMutation.mutate,
  };
}