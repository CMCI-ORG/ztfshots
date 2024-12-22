export interface SiteSettings {
  id: string;
  site_name: string;
  tag_line?: string | null;
  description?: string | null;
  icon_url?: string | null;
  logo_url?: string | null;
  cover_image_url?: string | null;
  created_at: string;
  updated_at: string;
}