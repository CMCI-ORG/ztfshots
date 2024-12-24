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
  const [currentPage, setCurrentPage] = useState(1);
  const { users, error, isLoading, isError, deactivateUser, updateUserRole } = useUsers();

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
                  onDeactivate={deactivateUser}
                  onUpdateRole={updateUserRole}
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
    </SubscriberErrorBoundary>
  );
}