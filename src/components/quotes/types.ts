import * as z from "zod";
import { 
  quoteTextSchema, 
  authorSchema, 
  categorySchema, 
  sourceSchema, 
  postDateSchema 
} from "./validation/quoteValidation";

export const quoteFormSchema = z.object({
  text: quoteTextSchema,
  author_id: authorSchema,
  category_id: categorySchema,
  source_title: sourceSchema.shape.title,
  source_url: sourceSchema.shape.url,
  post_date: postDateSchema,
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

// Runtime type guard
export function isQuoteFormValues(value: unknown): value is QuoteFormValues {
  try {
    quoteFormSchema.parse(value);
    return true;
  } catch {
    return false;
  }
}