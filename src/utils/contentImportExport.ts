import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { quoteSchema, authorSchema, categorySchema } from "./validation";

// Define valid table names
type TableName = "quotes" | "authors" | "categories";

// Generic import/export function
async function exportContent<T>(
  table: TableName,
  select: string = "*"
): Promise<T[]> {
  const { data, error } = await supabase
    .from(table)
    .select(select);

  if (error) throw error;

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${table}-export-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  return data as T[];
}

async function importContent<T>(
  file: File,
  table: TableName,
  schema: z.ZodType<T>,
  transform?: (data: T) => any
): Promise<void> {
  const content = await file.text();
  const data = JSON.parse(content);
  
  const validationResult = z.array(schema).safeParse(data);
  
  if (!validationResult.success) {
    throw new Error(`Invalid import file format: ${validationResult.error.message}`);
  }

  const transformedData = transform 
    ? validationResult.data.map(transform)
    : validationResult.data;

  const { error } = await supabase
    .from(table)
    .insert(transformedData);

  if (error) throw error;
}

// Specific export functions with proper typing
export const exportQuotes = () => exportContent("quotes", `
  *,
  author:authors(name),
  category:categories(name)
`);

export const exportAuthors = () => exportContent("authors");
export const exportCategories = () => exportContent("categories");

// Specific import functions with proper typing
export const importQuotes = (file: File) => 
  importContent(file, "quotes", quoteSchema, (quote) => ({
    text: quote.text,
    author_id: quote.author_id,
    category_id: quote.category_id,
    source_title: quote.source_title,
    source_url: quote.source_url,
    post_date: quote.post_date,
    title: quote.title,
    status: quote.status
  }));

export const importAuthors = (file: File) => 
  importContent(file, "authors", authorSchema);

export const importCategories = (file: File) => 
  importContent(file, "categories", categorySchema);