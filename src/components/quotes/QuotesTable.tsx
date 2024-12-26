import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { QuoteDeleteDialog } from "./QuoteDeleteDialog";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

// Define your types and queries here
// ...

export function QuotesTable() {
  const [quoteToDelete, setQuoteToDelete] = useState<{ id: string; text: string } | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quotes, error } = useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("quotes").select("*");
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (quoteId: string) => {
      // Delete the quote
      const { error: deleteError } = await supabase
        .from("quotes")
        .delete()
        .eq("id", quoteId);

      if (deleteError) throw deleteError;

      // Log the activity
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

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Text</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quotes?.map((quote) => (
            <tr key={quote.id}>
              <td>{quote.text}</td>
              <td>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuoteToDelete({ id: quote.id, text: quote.text })}
                  className="text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Add the delete dialog */}
      <QuoteDeleteDialog
        quote={quoteToDelete}
        onOpenChange={(open) => !open && setQuoteToDelete(null)}
        onConfirmDelete={handleDelete}
      />
    </div>
  );
}
