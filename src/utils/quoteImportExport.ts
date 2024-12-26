import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const quoteImportSchema = z.array(z.object({
  text: z.string().min(10, "Quote text must be at least 10 characters"),
  author_id: z.string().uuid("Invalid author ID"),
  category_id: z.string().uuid("Invalid category ID"),
  source_title: z.string().optional(),
  source_url: z.string().url().optional(),
  post_date: z.string().datetime(),
  title: z.string().optional(),
  status: z.enum(['live', 'scheduled']).default('live')
}));

type QuoteImport = z.infer<typeof quoteImportSchema>[0];

export const exportQuotes = async () => {
  const { data: quotes, error } = await supabase
    .from("quotes")
    .select(`
      *,
      author:authors(name),
      category:categories(name)
    `);

  if (error) throw error;

  const exportData = quotes.map(quote => ({
    text: quote.text,
    author_id: quote.author_id,
    category_id: quote.category_id,
    source_title: quote.source_title,
    source_url: quote.source_url,
    post_date: quote.post_date,
    title: quote.title,
    status: quote.status,
    // Include reference data for easier verification
    _author_name: quote.author?.name,
    _category_name: quote.category?.name,
  }));

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `quotes-export-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const importQuotes = async (file: File) => {
  const content = await file.text();
  const data = JSON.parse(content);
  
  const validationResult = quoteImportSchema.safeParse(data);
  
  if (!validationResult.success) {
    throw new Error("Invalid import file format: " + validationResult.error.message);
  }

  const quotesToInsert = validationResult.data.map((quote: QuoteImport) => ({
    text: quote.text,
    author_id: quote.author_id,
    category_id: quote.category_id,
    source_title: quote.source_title,
    source_url: quote.source_url,
    post_date: quote.post_date,
    title: quote.title,
    status: quote.status
  }));

  const { data: result, error } = await supabase
    .from("quotes")
    .insert(quotesToInsert);

  if (error) throw error;
  
  return result;
};