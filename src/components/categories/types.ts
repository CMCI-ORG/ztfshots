export interface Category {
  id: string;
  name: string;
  description: string;
  quote_count: number;
  translations: Record<string, any> | null;
  primary_language?: string | null;
}