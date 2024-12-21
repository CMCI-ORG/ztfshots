import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
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
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function QuotesTable() {
  const { toast } = useToast();
  const [quoteToDelete, setQuoteToDelete] = useState<{ id: string; text: string } | null>(null);

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
      const { error } = await supabase.from("quotes").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Quote deleted successfully",
      });
      
      refetch();
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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes?.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell className="max-w-md truncate">{quote.text}</TableCell>
                <TableCell>{quote.authors?.name}</TableCell>
                <TableCell>{quote.categories?.name}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuoteToDelete({ id: quote.id, text: quote.text })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <AlertDialog 
          open={quoteToDelete !== null} 
          onOpenChange={() => setQuoteToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the quote
                {quoteToDelete?.text ? ` "${quoteToDelete.text}"` : ""} and remove
                it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => quoteToDelete && handleDelete(quoteToDelete.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ErrorBoundary>
  );
}