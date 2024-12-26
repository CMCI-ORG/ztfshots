export interface Translation {
  text: string;
  title?: string;
}

export interface Translations {
  [key: string]: Translation;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}