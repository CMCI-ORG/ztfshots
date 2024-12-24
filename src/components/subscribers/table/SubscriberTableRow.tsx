import { format } from "date-fns";
import { Edit, XOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubscriberStatusBadge } from "../SubscriberStatusBadge";
import { User, UserRole } from "@/integrations/supabase/types/users";
import { Badge } from "@/components/ui/badge";

interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDeactivate: (id: string) => void;
  onUpdateRole: (userId: string, role: UserRole) => void;
}

export function SubscriberTableRow({ 
  user, 
  onEdit, 
  onDeactivate,
  onUpdateRole
}: UserTableRowProps) {
  const roles: UserRole[] = ['subscriber', 'editor', 'author', 'admin', 'superadmin'];

  return (
    <TableRow key={user.id}>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Select
          value={user.role}
          onValueChange={(value: UserRole) => onUpdateRole(user.id, value)}
          disabled={user.status === 'inactive'}
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
      <TableCell>
        <SubscriberStatusBadge status={user.status} />
      </TableCell>
      <TableCell>
        {format(new Date(user.created_at), "PPP")}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(user)}
            disabled={user.status === 'inactive'}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (confirm('Are you sure you want to deactivate this user?')) {
                onDeactivate(user.id);
              }
            }}
            disabled={user.status === 'inactive'}
          >
            <XOctagon className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}