import * as z from "zod";

export const quoteFormSchema = z.object({
  text: z.string().min(10, {
    message: "Quote must be at least 10 characters.",
  }),
  author_id: z.string({
    required_error: "Please select an author.",
  }),
  category_id: z.string({
    required_error: "Please select a category.",
  }),
  source_title: z.string().optional(),
  source_url: z.string().url().optional(),
  post_date: z.date({
    required_error: "Please select a post date.",
  }),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

// Runtime type guard for QuoteFormValues
export function isQuoteFormValues(value: unknown): value is QuoteFormValues {
  const result = quoteFormSchema.safeParse(value);
  return result.success;
}