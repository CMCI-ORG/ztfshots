import { useState } from "react";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { QuoteTableRow } from "./QuoteTableRow";
import { QuoteDeleteDialog } from "./QuoteDeleteDialog";
import { EditQuoteForm } from "./EditQuoteForm";
import { QuoteTableHeader } from "./QuoteTableHeader";
import { useQuotesData } from "./hooks/useQuotesData";
import { useQuoteDelete } from "./hooks/useQuoteDelete";
import { QuoteTableToolbar } from "./QuoteTableToolbar";
import { QuoteTablePagination } from "./QuoteTablePagination";

const ITEMS_PER_PAGE = 10;

export function QuotesTable() {
  const [quoteToDelete, setQuoteToDelete] = useState<{ id: string; text: string } | null>(null);
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { data: quotes, error: fetchError } = useQuotesData(statusFilter);
  const { handleDelete } = useQuoteDelete();

  const handleEditSuccess = async () => {
    setEditingQuoteId(null);
  };

  const handleDeleteConfirm = async (id: string): Promise<void> => {
    await handleDelete(id);
  };

  if (fetchError) {
    throw fetchError;
  }

  // Calculate pagination
  const totalPages = Math.ceil((quotes?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentQuotes = quotes?.slice(startIndex, endIndex);

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        <QuoteTableToolbar 
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        
        <div className="rounded-md border">
          <Table>
            <QuoteTableHeader />
            <TableBody>
              {currentQuotes?.map((quote) => (
                editingQuoteId === quote.id ? (
                  <tr key={quote.id}>
                    <td colSpan={6} className="p-4">
                      <EditQuoteForm
                        quote={quote}
                        onSuccess={handleEditSuccess}
                        onCancel={() => setEditingQuoteId(null)}
                      />
                    </td>
                  </tr>
                ) : (
                  <QuoteTableRow
                    key={quote.id}
                    quote={quote}
                    onEdit={() => setEditingQuoteId(quote.id)}
                    onDelete={setQuoteToDelete}
                  />
                )
              ))}
            </TableBody>
          </Table>
        </div>

        <QuoteTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <QuoteDeleteDialog
          quote={quoteToDelete}
          onOpenChange={(open) => !open && setQuoteToDelete(null)}
          onConfirmDelete={handleDeleteConfirm}
        />
      </div>
    </ErrorBoundary>
  );
}