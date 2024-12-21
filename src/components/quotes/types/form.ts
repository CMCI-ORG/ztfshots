import * as z from "zod";

// Stricter validation for URLs
const urlSchema = z.string().url().refine(
  (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  { message: "Invalid URL format" }
);

// Stricter validation for dates
const dateSchema = z.date()
  .refine(
    (date) => date instanceof Date && !isNaN(date.getTime()),
    { message: "Invalid date format" }
  );

// Enhanced quote form schema with stricter validations
export const quoteFormSchema = z.object({
  text: z.string()
    .min(10, { message: "Quote must be at least 10 characters." })
    .max(500, { message: "Quote must not exceed 500 characters." })
    .refine(
      (text) => text.trim().length > 0,
      { message: "Quote cannot be only whitespace" }
    ),
  author_id: z.string({
    required_error: "Please select an author.",
  }).uuid({ message: "Invalid author ID format" }),
  category_id: z.string({
    required_error: "Please select a category.",
  }).uuid({ message: "Invalid category ID format" }),
  source_title: z.string().optional()
    .transform(val => val === "" ? undefined : val),
  source_url: urlSchema.optional()
    .transform(val => val === "" ? undefined : val),
  post_date: dateSchema,
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