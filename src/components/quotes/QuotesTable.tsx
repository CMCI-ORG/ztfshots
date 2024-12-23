import { useState } from "react";
import {
  Table,
  TableBody,
  TableRow,
} from "@/components/ui/table";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { QuoteTableRow } from "./QuoteTableRow";
import { QuoteDeleteDialog } from "./QuoteDeleteDialog";
import { EditQuoteForm } from "./EditQuoteForm";
import { QuoteTableHeader } from "./QuoteTableHeader";
import { useQuotesData } from "./hooks/useQuotesData";
import { useQuoteDelete } from "./hooks/useQuoteDelete";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

export function QuotesTable() {
  const [quoteToDelete, setQuoteToDelete] = useState<{ id: string; text: string } | null>(null);
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: quotes, error: fetchError } = useQuotesData();
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
        <div className="rounded-md border">
          <Table>
            <QuoteTableHeader />
            <TableBody>
              {currentQuotes?.map((quote) => (
                editingQuoteId === quote.id ? (
                  <TableRow key={quote.id}>
                    <td colSpan={6} className="p-4">
                      <EditQuoteForm
                        quote={quote}
                        onSuccess={handleEditSuccess}
                        onCancel={() => setEditingQuoteId(null)}
                      />
                    </td>
                  </TableRow>
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

        <QuoteDeleteDialog
          quote={quoteToDelete}
          onOpenChange={(open) => !open && setQuoteToDelete(null)}
          onConfirmDelete={handleDeleteConfirm}
        />
      </div>
    </ErrorBoundary>
  );
}