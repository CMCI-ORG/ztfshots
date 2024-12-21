export type Quote = {
  id: string;
  text: string;
  author_id: string;
  category_id: string;
  source_title?: string;
  source_url?: string;
  post_date: Date;
  status: 'live' | 'scheduled';
  created_at: string;
  updated_at: string;
}

export type QuoteInsert = Omit<Quote, 'id' | 'created_at' | 'updated_at'>;
export type QuoteUpdate = Partial<QuoteInsert>;