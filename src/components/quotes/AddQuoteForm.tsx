import { QuoteForm } from "./QuoteForm";

interface AddQuoteFormProps {
  onSuccess?: () => void;
}

export function AddQuoteForm({ onSuccess }: AddQuoteFormProps) {
  return <QuoteForm mode="add" onSuccess={onSuccess} />;
}