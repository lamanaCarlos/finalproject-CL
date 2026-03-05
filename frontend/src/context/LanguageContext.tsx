import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { STORAGE_KEYS } from '../utils/constants';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState<Language>(
    (localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language) || 'es'
  );

  useEffect(() => {
    const storedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language;
    if (storedLanguage && storedLanguage !== language) {
      i18n.changeLanguage(storedLanguage);
      setLanguage(storedLanguage);
    }
  }, [i18n, language]);

  const changeLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    setLanguage(lang);
  };

  const value: LanguageContextType = {
    language,
    changeLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
