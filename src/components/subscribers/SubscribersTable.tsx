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

export function SubscribersTable() {
  const [editingSubscriber, setEditingSubscriber] = useState<any>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: subscribers, error, isLoading } = useQuery({
    queryKey: ["subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscribers")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
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
      const { error } = await supabase
        .from("subscribers")
        .update({ 
          name, 
          email, 
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
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update subscriber",
        variant: "destructive",
      });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: async (id: string) => {
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
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to deactivate subscriber",
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