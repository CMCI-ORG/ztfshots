export interface TranslatableItem {
  id: string;
  title?: string;
  text?: string;
  translations?: Record<string, any>;
  primary_language?: string;
}

export interface TranslationEditorProps {
  itemId: string;
  itemType: 'quotes' | 'categories' | 'pages_content';
  onClose: () => void;
  languages: Array<{
    code: string;
    name: string;
    native_name: string;
  }>;
}