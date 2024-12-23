import { format } from "date-fns";
import { Edit, XOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { SubscriberStatusBadge } from "../SubscriberStatusBadge";
import { Subscriber } from "@/integrations/supabase/types/users";

interface SubscriberTableRowProps {
  subscriber: Subscriber;
  onEdit: (subscriber: Subscriber) => void;
  onDeactivate: (id: string) => void;
}

export function SubscriberTableRow({ 
  subscriber, 
  onEdit, 
  onDeactivate 
}: SubscriberTableRowProps) {
  return (
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
            onClick={() => onEdit(subscriber)}
            disabled={subscriber.status === 'inactive'}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (confirm('Are you sure you want to deactivate this subscriber?')) {
                onDeactivate(subscriber.id);
              }
            }}
            disabled={subscriber.status === 'inactive'}
          >
            <XOctagon className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}