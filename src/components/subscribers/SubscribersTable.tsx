import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { useState } from "react";
import { EditSubscriberDialog } from "./EditSubscriberDialog";
import { SubscriberTableHeader } from "./table/SubscriberTableHeader";
import { SubscriberTableRow } from "./table/SubscriberTableRow";
import { SubscriberTableSkeleton } from "./table/SubscriberTableSkeleton";
import { useSubscribers } from "./hooks/useSubscribers";
import { Subscriber } from "@/integrations/supabase/types/users";
import { supabase } from "@/integrations/supabase/client";
import DOMPurify from "dompurify";
import { useToast } from "@/components/ui/use-toast";

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
  const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(null);
  const { subscribers, error, isLoading, deactivateSubscriber } = useSubscribers();
  const { toast } = useToast();

  // Get CSRF token
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

  if (error) {
    console.error("Error fetching subscribers:", error);
    return (
      <div className="p-4 text-red-500">
        Error loading subscribers. Please try again later.
      </div>
    );
  }

  const handleSubscriberUpdate = async ({ id, name, email, notify_new_quotes, notify_weekly_digest }: {
    id: string;
    name: string;
    email: string;
    notify_new_quotes: boolean;
    notify_weekly_digest: boolean;
  }) => {
    try {
      if (!rateLimiter.canMakeCall()) {
        toast({
          title: "Please wait",
          description: "Too many requests. Please try again in a moment.",
          variant: "destructive",
        });
        return;
      }

      // Sanitize input
      const sanitizedName = DOMPurify.sanitize(name);
      const sanitizedEmail = DOMPurify.sanitize(email);

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedEmail)) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        return;
      }

      // Add CSRF token to request headers
      const headers: Record<string, string> = {};
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
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

      toast({
        title: "Success",
        description: "Subscriber updated successfully",
      });

      setEditingSubscriber(null);
    } catch (error) {
      console.error("Error updating subscriber:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update subscriber",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <SubscriberTableHeader />
          {isLoading ? (
            <SubscriberTableSkeleton />
          ) : (
            <TableBody>
              {subscribers?.map((subscriber) => (
                <SubscriberTableRow
                  key={subscriber.id}
                  subscriber={subscriber}
                  onEdit={setEditingSubscriber}
                  onDeactivate={deactivateSubscriber}
                />
              ))}
              {subscribers?.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No subscribers yet
                  </td>
                </tr>
              )}
            </TableBody>
          )}
        </Table>
      </div>

      <EditSubscriberDialog
        subscriber={editingSubscriber}
        onClose={() => setEditingSubscriber(null)}
        onSubmit={handleSubscriberUpdate}
      />
    </>
  );
}