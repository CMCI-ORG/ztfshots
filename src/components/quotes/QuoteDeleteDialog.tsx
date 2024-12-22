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

interface QuoteDeleteDialogProps {
  quote: { id: string; text: string } | null;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: (id: string) => Promise<void>;
}

export function QuoteDeleteDialog({ quote, onOpenChange, onConfirmDelete }: QuoteDeleteDialogProps) {
  return (
    <AlertDialog open={quote !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent
        aria-labelledby="delete-quote-title"
        aria-describedby="delete-quote-description"
      >
        <AlertDialogHeader>
          <AlertDialogTitle id="delete-quote-title">Are you sure?</AlertDialogTitle>
          <AlertDialogDescription id="delete-quote-description">
            This action cannot be undone. This will permanently delete the quote
            {quote?.text ? ` "${quote.text}"` : ""} and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => quote && onConfirmDelete(quote.id)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}