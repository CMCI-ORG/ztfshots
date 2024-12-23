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

export function SubscribersTable() {
  const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(null);
  const { subscribers, error, isLoading, deactivateSubscriber } = useSubscribers();

  if (error) {
    console.error("Error fetching subscribers:", error);
    return (
      <div className="p-4 text-red-500">
        Error loading subscribers. Please try again later.
      </div>
    );
  }

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
        onSubmit={async ({ id, name, email, notify_new_quotes, notify_weekly_digest }) => {
          // Add CSRF token to all requests
          const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
          const headers = csrfToken ? { 'X-CSRF-Token': csrfToken } : {};

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
        }}
      />
    </>
  );
}
