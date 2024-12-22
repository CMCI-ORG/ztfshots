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
  title: z.string()
    .min(1, { message: "Source title is required when URL is provided" })
    .optional()
    .transform(val => val === "" ? undefined : val),
  url: z.string()
    .url({ message: "Invalid URL format. Must start with http:// or https://" })
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Invalid URL format" }
    )
    .transform(val => val === "" ? undefined : val),
});

export const postDateSchema = z.date({
  required_error: "Please select a post date.",
}).refine(
  (date) => date > new Date(new Date().setHours(0, 0, 0, 0)),
  { message: "Post date must be in the future" }
);