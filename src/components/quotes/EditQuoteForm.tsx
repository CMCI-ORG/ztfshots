import { QuoteForm } from "./QuoteForm";
import { Button } from "@/components/ui/button";

interface Quote {
  id: string;
  text: string;
  author_id: string;
  category_id: string;
  source_title?: string;
  source_url?: string;
  title?: string;
  post_date: string;
  status: string;
}

interface EditQuoteFormProps {
  quote: Quote;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditQuoteForm({ quote, onSuccess, onCancel }: EditQuoteFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Edit Quote</h3>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
      <QuoteForm
        mode="edit"
        quoteId={quote.id}
        initialValues={{
          text: quote.text,
          author_id: quote.author_id,
          category_id: quote.category_id,
          source_title: quote.source_title || "",
          source_url: quote.source_url || "",
          title: quote.title || "",
          post_date: new Date(quote.post_date),
        }}
        onSuccess={onSuccess}
      />
    </div>
  );
}