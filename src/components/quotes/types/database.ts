// Database types for quotes
export interface QuoteRecord {
  id: string;
  text: string;
  author_id: string;
  category_id: string;
  source_title?: string | null;
  source_url?: string | null;
  post_date: string;
  status: 'live' | 'scheduled';
  created_at: string;
  updated_at: string;
}

export interface AuthorRecord {
  id: string;
  name: string;
  bio?: string | null;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryRecord {
  id: string;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}