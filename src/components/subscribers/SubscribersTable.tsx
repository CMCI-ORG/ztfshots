import { useState } from "react";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { EditSubscriberDialog } from "./EditSubscriberDialog";
import { SubscriberTableHeader } from "./table/SubscriberTableHeader";
import { SubscriberTableRow } from "./table/SubscriberTableRow";
import { SubscriberTableSkeleton } from "./table/SubscriberTableSkeleton";
import { useSubscribers } from "./hooks/useSubscribers";
import { SubscriberErrorBoundary } from "./SubscriberErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Subscriber } from "@/integrations/supabase/types/users";
import { supabase } from "@/integrations/supabase/client";

export function SubscribersTable() {
  const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(null);
  const { subscribers, error, isLoading, isError, deactivateSubscriber } = useSubscribers();

  if (isLoading) {
    return <SubscriberTableSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error instanceof Error ? error.message : "Failed to load subscribers"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <SubscriberErrorBoundary>
      <div className="rounded-md border">
        <Table>
          <SubscriberTableHeader />
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
                  No subscribers found
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>

      <EditSubscriberDialog
        subscriber={editingSubscriber}
        onClose={() => setEditingSubscriber(null)}
        onSubmit={async (data) => {
          try {
            const { error } = await supabase
              .from("subscribers")
              .update(data)
              .eq("id", data.id);

            if (error) throw error;
            setEditingSubscriber(null);
          } catch (error) {
            console.error("Error updating subscriber:", error);
            throw error;
          }
        }}
      />
    </SubscriberErrorBoundary>
  );
}