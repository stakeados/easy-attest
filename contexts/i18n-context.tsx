'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Locale,
  Translations,
  en,
  es,
  detectBrowserLocale,
  getStoredLocale,
  setStoredLocale,
  getNestedValue,
} from '@/lib/i18n';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const translationsMap: Record<Locale, Translations> = {
  en,
  es,
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize locale on mount
  useEffect(() => {
    const storedLocale = getStoredLocale();
    const initialLocale = storedLocale || detectBrowserLocale();
    setLocaleState(initialLocale);
    setIsInitialized(true);
  }, []);

  // Update HTML lang attribute when locale changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setStoredLocale(newLocale);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const translations = translationsMap[locale];
      return getNestedValue(translations, key);
    },
    [locale]
  );

  // Don't render children until locale is initialized to avoid flash of wrong language
  if (!isInitialized) {
    return null;
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation(): I18nContextValue {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
