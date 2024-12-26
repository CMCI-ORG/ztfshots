import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { QuoteDeleteDialog } from "./QuoteDeleteDialog";
import { EditQuoteForm } from "./EditQuoteForm";
import { useAuth } from "@/providers/AuthProvider";
import { Table, TableBody } from "@/components/ui/table";
import { QuoteTableHeader } from "./QuoteTableHeader";
import { QuoteTableRow } from "./QuoteTableRow";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type Quote } from "@/integrations/supabase/database/quote.types";

export function QuotesTable() {
  const [quoteToDelete, setQuoteToDelete] = useState<{ id: string; text: string } | null>(null);
  const [quoteToEdit, setQuoteToEdit] = useState<Quote | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quotes, error, isLoading } = useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id(name),
          categories:category_id(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to ensure translations is the correct type
      return data.map(quote => ({
        ...quote,
        translations: quote.translations as Record<string, { text: string; title?: string }>
      }));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (quoteId: string) => {
      const { error: deleteError } = await supabase
        .from("quotes")
        .delete()
        .eq("id", quoteId);

      if (deleteError) throw deleteError;

      const { error: logError } = await supabase
        .from("activity_logs")
        .insert({
          admin_id: user?.id,
          action_type: "delete",
          entity_type: "quote",
          entity_id: quoteId,
          details: {
            quote_text: quoteToDelete?.text,
          },
        });

      if (logError) {
        console.error("Failed to log activity:", logError);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      toast({
        title: "Quote deleted",
        description: "The quote has been permanently deleted.",
      });
      setQuoteToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete quote. Please try again.",
        variant: "destructive",
      });
      console.error("Delete error:", error);
    },
  });

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading quotes: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden">
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border bg-background">
      {quoteToEdit ? (
        <div className="p-6">
          <EditQuoteForm
            quote={quoteToEdit}
            onSuccess={() => {
              setQuoteToEdit(null);
              queryClient.invalidateQueries({ queryKey: ["quotes"] });
            }}
            onCancel={() => setQuoteToEdit(null)}
          />
        </div>
      ) : (
        <div className="rounded-md">
          <Table>
            <QuoteTableHeader />
            <TableBody>
              {quotes?.map((quote) => (
                <QuoteTableRow
                  key={quote.id}
                  quote={quote as Quote}
                  onEdit={setQuoteToEdit}
                  onDelete={setQuoteToDelete}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <QuoteDeleteDialog
        quote={quoteToDelete}
        onOpenChange={(open) => !open && setQuoteToDelete(null)}
        onConfirmDelete={handleDelete}
      />
    </Card>
  );
}
