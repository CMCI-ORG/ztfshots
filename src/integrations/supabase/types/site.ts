import { Database } from "../types";

export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];

export type SiteSettingsFormData = {
  site_name: string;
  tag_line?: string | null;
  description?: string | null;
  icon_url?: string | null;
  logo_url?: string | null;
  cover_image_url?: string | null;
  header_display_type: "text" | "logo";
  translations?: Record<string, any> | null;
  primary_language?: string | null;
};