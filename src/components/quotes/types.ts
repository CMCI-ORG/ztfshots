import * as z from "zod";
import { Translation, Translations } from "./types/translations";

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
  source_url: z.string().url().optional()
    .transform(val => val === "" ? undefined : val),
  post_date: z.date(),
  title: z.string().optional(),
  translations: z.record(z.string(), z.object({
    text: z.string(),
    title: z.string().optional()
  })).optional(),
  primary_language: z.string().min(2).max(5)
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

export interface Quote extends QuoteFormValues {
  id: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published';
  translations: Translations;
}

// Runtime type guard
export function isQuoteFormValues(value: unknown): value is QuoteFormValues {
  try {
    quoteFormSchema.parse(value);
    return true;
  } catch {
    return false;
  }
}