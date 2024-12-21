import { z } from "zod";

export const quoteTextSchema = z.string()
  .min(10, { message: "Quote must be at least 10 characters." })
  .max(500, { message: "Quote must not exceed 500 characters." })
  .refine(
    (text) => text.trim().length > 0,
    { message: "Quote cannot be only whitespace" }
  );

export const authorSchema = z.string({
  required_error: "Please select an author.",
}).uuid({ message: "Invalid author ID format" });

export const categorySchema = z.string({
  required_error: "Please select a category.",
}).uuid({ message: "Invalid category ID format" });

export const sourceSchema = z.object({
  title: z.string().optional().transform(val => val === "" ? undefined : val),
  url: z.string().url().optional().transform(val => val === "" ? undefined : val),
});

export const postDateSchema = z.date({
  required_error: "Please select a post date.",
}).refine(
  (date) => date instanceof Date && !isNaN(date.getTime()),
  { message: "Invalid date format" }
);