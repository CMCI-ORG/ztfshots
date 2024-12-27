import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { NotificationUser } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="rounded-md border overflow-hidden">
      <ScrollArea className="max-w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Select</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="min-w-[200px]">Email</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="min-w-[150px]">Last Notification</TableHead>
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
                <TableRow key={user.id} className="group">
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => onUserSelect(user.id)}
                      className="w-5 h-5"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="break-all">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.email_status === "verified" ? "success" : "secondary"}>
                      {user.email_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
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
      </ScrollArea>
    </div>
  );
};