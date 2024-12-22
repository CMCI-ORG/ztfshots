import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { QuoteTableRow } from "./QuoteTableRow";
import { QuoteDeleteDialog } from "./QuoteDeleteDialog";
import { QuoteEditDialog } from "./QuoteEditDialog";

export function QuotesTable() {
  const { toast } = useToast();
  const [quoteToDelete, setQuoteToDelete] = useState<{ id: string; text: string } | null>(null);
  const [editingQuote, setEditingQuote] = useState(null);

  const { data: quotes, error: fetchError, refetch } = useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("quotes")
          .select(`
            *,
            authors:author_id(name),
            categories:category_id(name)
          `)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error fetching quotes:", error);
        throw error;
      }
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("quotes")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting quote:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Quote deleted successfully",
      });
      
      await refetch();
    } catch (error) {
      console.error("Error deleting quote:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete quote",
        variant: "destructive",
      });
    }
    setQuoteToDelete(null);
  };

  if (fetchError) {
    throw fetchError;
  }

  return (
    <ErrorBoundary>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quote</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes?.map((quote) => (
              <QuoteTableRow
                key={quote.id}
                quote={quote}
                onEdit={setEditingQuote}
                onDelete={setQuoteToDelete}
              />
            ))}
          </TableBody>
        </Table>

        <QuoteEditDialog
          quote={editingQuote}
          onOpenChange={(open) => !open && setEditingQuote(null)}
          onSuccess={refetch}
        />

        <QuoteDeleteDialog
          quote={quoteToDelete}
          onOpenChange={(open) => !open && setQuoteToDelete(null)}
          onConfirmDelete={handleDelete}
        />
      </div>
    </ErrorBoundary>
  );
}