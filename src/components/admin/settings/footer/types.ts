export type ContentType = 'text' | 'link' | 'feed' | 'image' | 'address' | 'social';

export interface FooterContentType {
  id: string;
  name: string;
  type: ContentType;
  fields: Record<string, any>;
}

export interface FooterColumn {
  id: string;
  position: number;
}

export interface FooterContent {
  id: string;
  column_id: string;
  content_type_id: string;
  title: string | null;
  content: Record<string, any>;
  order_position: number;
}