import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, XOctagon, Power } from "lucide-react";
import { SubscriberStatusBadge } from "../SubscriberStatusBadge";
import { User, UserRole } from "@/integrations/supabase/types/users";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onDeactivate: (id: string) => void;
  onReactivate: (id: string) => void;
  onUpdateRole: (userId: string, role: UserRole) => void;
}

export function SubscriberTableRow({ 
  user, 
  onEdit, 
  onDelete,
  onDeactivate,
  onReactivate,
  onUpdateRole
}: UserTableRowProps) {
  const roles: UserRole[] = ['subscriber', 'editor', 'author', 'admin', 'superadmin'];
  const isInactive = user.status === 'inactive';

  return (
    <TableRow key={user.id}>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Select
          value={user.role}
          onValueChange={(value: UserRole) => onUpdateRole(user.id, value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue>
              <Badge variant={user.role === "admin" || user.role === "superadmin" ? "default" : "secondary"}>
                {user.role}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                <Badge variant={role === "admin" || role === "superadmin" ? "default" : "secondary"}>
                  {role}
                </Badge>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>{user.nation || '-'}</TableCell>
      <TableCell>
        <SubscriberStatusBadge status={user.status} />
      </TableCell>
      <TableCell>
        {new Date(user.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(user)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(user)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {isInactive ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onReactivate(user.id)}
            >
              <Power className="h-4 w-4 text-green-500" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeactivate(user.id)}
            >
              <XOctagon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}