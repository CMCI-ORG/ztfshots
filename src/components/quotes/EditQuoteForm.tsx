import { QuoteForm } from "./QuoteForm";

interface Quote {
  id: string;
  text: string;
  author_id: string;
  category_id: string;
  source_title?: string;
  source_url?: string;
}

interface EditQuoteFormProps {
  quote: Quote;
  onSuccess?: () => void;
}

export function EditQuoteForm({ quote, onSuccess }: EditQuoteFormProps) {
  return (
    <QuoteForm
      mode="edit"
      quoteId={quote.id}
      initialValues={{
        text: quote.text,
        author_id: quote.author_id,
        category_id: quote.category_id,
        source_title: quote.source_title || "",
        source_url: quote.source_url || "",
      }}
      onSuccess={onSuccess}
    />
  );
}