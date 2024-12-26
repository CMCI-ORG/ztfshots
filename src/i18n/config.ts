import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

// Default translations for fallback
const resources = {
  en: {
    translation: {
      common: {
        loading: 'Loading...',
        error: 'An error occurred',
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
      },
      auth: {
        signIn: 'Sign In',
        signOut: 'Sign Out',
        profile: 'Profile',
      },
      languages: {
        manage: 'Manage Languages',
        add: 'Add Language',
        edit: 'Edit Language',
        name: 'Language Name',
        code: 'Language Code',
        nativeName: 'Native Name',
        active: 'Active',
      },
    },
  },
};

const loadTranslations = async () => {
  const { data: languages } = await supabase
    .from('languages')
    .select('*')
    .eq('is_active', true);

  if (languages) {
    languages.forEach((lang) => {
      if (!resources[lang.code]) {
        resources[lang.code] = {
          translation: {
            common: {},
            auth: {},
            languages: {},
          },
        };
      }
    });
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

loadTranslations();

export default i18n;