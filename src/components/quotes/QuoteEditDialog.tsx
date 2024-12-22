import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EditQuoteForm } from "./EditQuoteForm";
import { useToast } from "@/components/ui/use-toast";

interface QuoteEditDialogProps {
  quote: any | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => Promise<void>;
}

export function QuoteEditDialog({ quote, onOpenChange, onSuccess }: QuoteEditDialogProps) {
  const { toast } = useToast();

  return (
    <Dialog open={quote !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Quote</DialogTitle>
          <DialogDescription>
            Make changes to the quote below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {quote && (
          <EditQuoteForm
            quote={quote}
            onSuccess={async () => {
              onOpenChange(false);
              await onSuccess();
              toast({
                title: "Success",
                description: "Quote updated successfully",
              });
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}