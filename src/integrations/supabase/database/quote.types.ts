export type Quote = {
  id: string;
  text: string;
  author_id: string;
  category_id: string;
  source_title?: string;
  source_url?: string;
  post_date: string;
  status: 'live' | 'scheduled';
  created_at: string;
  updated_at: string;
  title?: string;
  translations?: Record<string, { text: string; title?: string }>;
  primary_language?: string;
  authors?: { name: string };
  categories?: { name: string };
  source_id?: string;
}

export type QuoteInsert = Omit<Quote, 'id' | 'created_at' | 'updated_at'>;
export type QuoteUpdate = Partial<QuoteInsert>;