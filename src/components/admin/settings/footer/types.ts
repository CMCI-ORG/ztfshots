/**
 * Defines the content types available for footer content blocks
 */
export type ContentType = 'text' | 'link' | 'feed' | 'image' | 'address' | 'social' | 'links';

/**
 * Represents a footer content type configuration
 */
export interface FooterContentType {
  /** Unique identifier for the content type */
  id: string;
  /** Display name of the content type */
  name: string;
  /** Type identifier matching ContentType */
  type: ContentType;
  /** Configuration of fields for this content type */
  fields: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

/**
 * Represents a footer column configuration
 */
export interface FooterColumn {
  /** Unique identifier for the column */
  id: string;
  /** Position of the column in the footer (1-based) */
  position: number;
  /** Contents associated with this column */
  contents?: FooterContent[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Represents a content block within a footer column
 */
export interface FooterContent {
  /** Unique identifier for the content block */
  id: string;
  /** ID of the column this content belongs to */
  column_id: string;
  /** ID of the content type for this block */
  content_type_id: string;
  /** Optional title for the content block */
  title: string | null;
  /** Content data specific to the content type */
  content: Record<string, any>;
  /** Position of the content within its column */
  order_position: number;
  /** Whether the content is active */
  is_active: boolean;
  /** Associated content type information */
  content_type?: FooterContentType;
  created_at?: string;
  updated_at?: string;
}