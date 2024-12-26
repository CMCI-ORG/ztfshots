export interface TranslatableItem {
  id: string;
  title?: string;
  text?: string;
  name?: string;
  description?: string;
  content?: string;
  source_title?: string;
  source_url?: string;
  site_name?: string;
  tag_line?: string;
  bio?: string;
  translations?: Record<string, any>;
  primary_language?: string;
}

export interface TranslationEditorProps {
  itemId: string;
  itemType: 'quotes' | 'categories' | 'pages_content' | 'site_settings' | 'authors';
  onClose: () => void;
  languages: Array<{
    code: string;
    name: string;
    native_name: string;
  }>;
}