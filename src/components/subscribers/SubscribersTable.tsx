import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Edit, XOctagon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { EditSubscriberDialog } from "./EditSubscriberDialog";
import { SubscriberStatusBadge } from "./SubscriberStatusBadge";
import DOMPurify from 'dompurify';

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

export function SubscribersTable() {
  const [editingSubscriber, setEditingSubscriber] = useState<any>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Add CSRF token to all requests
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  const headers = csrfToken ? { 'X-CSRF-Token': csrfToken } : {};

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

      // Sanitize data before returning
      return data?.map(subscriber => ({
        ...subscriber,
        name: DOMPurify.sanitize(subscriber.name),
        email: DOMPurify.sanitize(subscriber.email)
      }));
    },
    retry: 2,
    staleTime: 30000, // Cache for 30 seconds
  });

  const updateMutation = useMutation({
    mutationFn: async ({ 
      id, 
      name, 
      email, 
      notify_new_quotes, 
      notify_weekly_digest 
    }: { 
      id: string; 
      name: string; 
      email: string;
      notify_new_quotes: boolean;
      notify_weekly_digest: boolean;
    }) => {
      if (!rateLimiter.canMakeCall()) {
        throw new Error("Too many requests. Please wait.");
      }

      // Sanitize input
      const sanitizedName = DOMPurify.sanitize(name);
      const sanitizedEmail = DOMPurify.sanitize(email);

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedEmail)) {
        throw new Error("Invalid email format");
      }

      const { error } = await supabase
        .from("subscribers")
        .update({ 
          name: sanitizedName, 
          email: sanitizedEmail, 
          notify_new_quotes, 
          notify_weekly_digest 
        })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribers"] });
      setEditingSubscriber(null);
      toast({
        title: "Success",
        description: "Subscriber updated successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Error updating subscriber:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update subscriber",
        variant: "destructive",
      });
    },
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

  if (error) {
    console.error("Error fetching subscribers:", error);
    return (
      <div className="p-4 text-red-500">
        Error loading subscribers. Please try again later.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subscribed On</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3].map((i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subscribed On</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers?.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell>{subscriber.name}</TableCell>
                <TableCell>{subscriber.email}</TableCell>
                <TableCell>
                  <SubscriberStatusBadge status={subscriber.status} />
                </TableCell>
                <TableCell>
                  {format(new Date(subscriber.created_at), "PPP")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingSubscriber(subscriber)}
                      disabled={subscriber.status === 'inactive'}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('Are you sure you want to deactivate this subscriber?')) {
                          deactivateMutation.mutate(subscriber.id);
                        }
                      }}
                      disabled={subscriber.status === 'inactive'}
                    >
                      <XOctagon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {subscribers?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No subscribers yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <EditSubscriberDialog
        subscriber={editingSubscriber}
        onClose={() => setEditingSubscriber(null)}
        onSubmit={updateMutation.mutate}
      />
    </>
  );
}