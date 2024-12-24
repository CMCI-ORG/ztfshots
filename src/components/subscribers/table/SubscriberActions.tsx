import { Button } from "@/components/ui/button";
import { User, UserRole } from "@/integrations/supabase/types/users";
import { Power, Pencil, Trash2 } from "lucide-react";

interface SubscriberActionsProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onDeactivate: (userId: string) => void;
  onReactivate: (userId: string) => void;
  onUpdateRole: (userId: string, role: UserRole) => void;
}

export const SubscriberActions = ({
  user,
  onEdit,
  onDelete,
  onDeactivate,
  onReactivate,
  onUpdateRole,
}: SubscriberActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(user)}
        className="hover:bg-gray-100"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      {user.status === 'active' ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDeactivate(user.id)}
          className="hover:bg-gray-100"
        >
          <Power className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onReactivate(user.id)}
          className="hover:bg-green-100 text-green-600"
        >
          <Power className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(user)}
        className="hover:bg-red-100 text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};