import { useState } from "react";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { EditSubscriberDialog } from "./EditSubscriberDialog";
import { SubscriberTableHeader } from "./table/SubscriberTableHeader";
import { SubscriberTableRow } from "./table/SubscriberTableRow";
import { SubscriberTableSkeleton } from "./table/SubscriberTableSkeleton";
import { useUsers } from "./hooks/useSubscribers";
import { SubscriberErrorBoundary } from "./SubscriberErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, UserRole } from "@/integrations/supabase/types/users";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

export function SubscribersTable() {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { users, error, isLoading, isError, deactivateUser, updateUserRole } = useUsers();

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", userToDelete.id);

      if (error) throw error;

      // Close the dialog and refresh the data
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (isLoading) {
    return <SubscriberTableSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error instanceof Error ? error.message : "Failed to load users"}
        </AlertDescription>
      </Alert>
    );
  }

  const totalPages = Math.ceil((users?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = users?.slice(startIndex, endIndex);

  return (
    <SubscriberErrorBoundary>
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <SubscriberTableHeader />
            <TableBody>
              {currentUsers?.map((user) => (
                <SubscriberTableRow
                  key={user.id}
                  user={user}
                  onEdit={setEditingUser}
                  onDelete={setUserToDelete}
                  onDeactivate={deactivateUser}
                  onUpdateRole={(userId: string, role: UserRole) => 
                    updateUserRole({ userId, role })}
                />
              ))}
              {currentUsers?.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No users found
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((page) => Math.max(1, page - 1));
                  }}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(i + 1);
                    }}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((page) => Math.min(totalPages, page + 1));
                  }}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <EditSubscriberDialog
        subscriber={editingUser}
        onClose={() => setEditingUser(null)}
        onSubmit={async (data) => {
          try {
            const { error } = await supabase
              .from("users")
              .update(data)
              .eq("id", data.id);

            if (error) throw error;
            setEditingUser(null);
          } catch (error) {
            console.error("Error updating user:", error);
            throw error;
          }
        }}
      />

      <AlertDialog open={userToDelete !== null} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              {userToDelete?.name ? ` "${userToDelete.name}"` : ''} and remove their
              data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SubscriberErrorBoundary>
  );
}