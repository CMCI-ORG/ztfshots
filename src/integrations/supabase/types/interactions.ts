export interface QuoteInteraction {
  id: string;
  quote_id: string;
  user_id: string | null;
  created_at: string;
}

export interface QuoteShare extends QuoteInteraction {
  share_type: string;
}