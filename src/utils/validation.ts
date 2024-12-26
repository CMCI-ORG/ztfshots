import { z } from "zod";

export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(1, "Email is required");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const profileSchema = z.object({
  display_name: z.string().min(2, "Display name must be at least 2 characters").optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

export const searchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  filters: z.record(z.string()).optional(),
});

export const quoteSchema = z.object({
  text: z.string()
    .min(10, "Quote must be at least 10 characters")
    .max(500, "Quote must not exceed 500 characters"),
  author_id: z.string().uuid("Invalid author ID"),
  category_id: z.string().uuid("Invalid category ID"),
  source_title: z.string().optional(),
  source_url: z.string().url("Invalid URL format").optional(),
  post_date: z.date(),
  title: z.string().optional(),
  status: z.enum(["live", "scheduled"]).default("live")
});

export const authorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(1000, "Bio must not exceed 1000 characters").optional(),
  image_url: z.string().url("Invalid image URL").optional()
});

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().max(500, "Description must not exceed 500 characters").optional()
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type SearchParams = z.infer<typeof searchSchema>;
export type QuoteData = z.infer<typeof quoteSchema>;
export type AuthorData = z.infer<typeof authorSchema>;
export type CategoryData = z.infer<typeof categorySchema>;