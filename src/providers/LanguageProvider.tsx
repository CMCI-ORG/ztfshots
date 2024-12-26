import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { toast } from 'sonner';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => Promise<void>;
  availableLanguages: Array<{
    code: string;
    name: string;
    nativeName: string;
  }>;
  getTranslatedContent: (content: any, field: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const { i18n } = useTranslation();
  const { user } = useAuth();

  // Function to detect browser language and match it with available languages
  const detectBrowserLanguage = async (languages: any[]) => {
    const browserLang = navigator.language.split('-')[0]; // Get base language code
    const isLanguageAvailable = languages.some(lang => lang.code === browserLang);
    
    if (isLanguageAvailable) {
      return browserLang;
    }
    return 'en'; // Fallback to English if browser language is not available
  };

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const { data: languages, error } = await supabase
          .from('languages')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;
        if (languages) {
          setAvailableLanguages(languages);
          
          // Only set browser language for first-time visitors without a language preference
          const storedLang = localStorage.getItem('preferred_language');
          if (!storedLang) {
            const detectedLang = await detectBrowserLanguage(languages);
            setLanguage(detectedLang);
          }
        }
      } catch (error) {
        console.error('Error loading languages:', error);
        toast.error('Failed to load available languages');
      }
    };

    loadLanguages();
  }, []);

  useEffect(() => {
    const loadUserLanguage = async () => {
      if (user?.id) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('preferred_language')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          if (profile?.preferred_language) {
            setLanguage(profile.preferred_language);
          }
        } catch (error) {
          console.error('Error loading user language preference:', error);
        }
      }
    };

    loadUserLanguage();
  }, [user]);

  const setLanguage = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
      setCurrentLanguage(lang);
      localStorage.setItem('preferred_language', lang);

      if (user?.id) {
        const { error } = await supabase
          .from('profiles')
          .update({ preferred_language: lang })
          .eq('id', user.id);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error setting language:', error);
      throw error;
    }
  };

  // Helper function to get translated content with fallback
  const getTranslatedContent = (content: any, field: string): string => {
    if (!content) return "";
    if (currentLanguage === content.primary_language) {
      return content[field];
    }
    return content.translations?.[currentLanguage]?.[field] || content[field];
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        availableLanguages,
        getTranslatedContent,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};