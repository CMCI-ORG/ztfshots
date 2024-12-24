import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { UserProfile, UserRole } from "@/types/users";

interface UserTableRowProps {
  user: UserProfile;
  onRoleChange: (userId: string, newRole: UserRole) => void;
  isUpdating: boolean;
  currentUserRole?: string;
}

const roles: UserRole[] = ["subscriber", "editor", "author", "admin", "superadmin"];

export const UserTableRow = ({ 
  user, 
  onRoleChange, 
  isUpdating,
  currentUserRole 
}: UserTableRowProps) => {
  const canChangeRoles = currentUserRole && ["admin", "superadmin"].includes(currentUserRole);
  
  return (
    <TableRow key={user.id}>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.username || "No username"}</TableCell>
      <TableCell>
        <Badge variant={user.role === "admin" || user.role === "superadmin" ? "default" : "secondary"}>
          {user.role || "subscriber"}
        </Badge>
      </TableCell>
      <TableCell>
        <Select
          value={user.role || "subscriber"}
          onValueChange={(value: UserRole) => onRoleChange(user.id, value)}
          disabled={isUpdating || !canChangeRoles}
        >
          <SelectTrigger className="w-32">
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SelectValue />
            )}
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  );
};