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

export function QuotesTable() {
  const [quoteToDelete, setQuoteToDelete] = useState<{ id: string; text: string } | null>(null);
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const { data: quotes, error: fetchError } = useQuotesData();
  const { handleDelete } = useQuoteDelete();

  const handleEditSuccess = async () => {
    setEditingQuoteId(null);
  };

  // Wrapper function to match the expected void return type
  const handleDeleteConfirm = async (id: string): Promise<void> => {
    await handleDelete(id);
  };

  if (fetchError) {
    throw fetchError;
  }

  return (
    <ErrorBoundary>
      <div className="rounded-md border">
        <Table>
          <QuoteTableHeader />
          <TableBody>
            {quotes?.map((quote) => (
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

        <QuoteDeleteDialog
          quote={quoteToDelete}
          onOpenChange={(open) => !open && setQuoteToDelete(null)}
          onConfirmDelete={handleDeleteConfirm}
        />
      </div>
    </ErrorBoundary>
  );
}