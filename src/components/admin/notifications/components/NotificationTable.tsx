import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { NotificationUser } from "../types";

interface NotificationTableProps {
  users: NotificationUser[] | undefined;
  selectedUsers: string[];
  isLoading: boolean;
  onUserSelect: (userId: string) => void;
}

export const NotificationTable = ({ 
  users, 
  selectedUsers, 
  isLoading,
  onUserSelect 
}: NotificationTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Select</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Notification</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Loading subscribers...
              </TableCell>
            </TableRow>
          ) : users?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No subscribers found
              </TableCell>
            </TableRow>
          ) : (
            users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => onUserSelect(user.id)}
                  />
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.email_status === "verified" ? "success" : "secondary"}>
                    {user.email_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.last_notification ? (
                    format(new Date(user.last_notification), "PPp")
                  ) : (
                    "Never"
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};