import { Translations, Locale } from './types';

/**
 * Get a nested value from an object using dot notation
 * @param obj - The object to search
 * @param path - The dot-notation path (e.g., 'common.loading')
 * @returns The value at the path, or the path itself if not found
 */
export function getNestedValue(obj: any, path: string): string {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      // Return the path itself if not found (for debugging)
      console.warn(`Translation key not found: ${path}`);
      return path;
    }
  }

  return typeof current === 'string' ? current : path;
}

/**
 * Detect the user's preferred locale from browser settings
 * @returns The detected locale, defaulting to 'en'
 */
export function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const browserLang = navigator.language || (navigator as any).userLanguage;
  
  // Check if the browser language starts with 'es' (Spanish)
  if (browserLang && browserLang.toLowerCase().startsWith('es')) {
    return 'es';
  }

  // Default to English
  return 'en';
}

/**
 * Get locale preference from localStorage
 * @returns The stored locale, or null if not found
 */
export function getStoredLocale(): Locale | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem('easy-attest-locale');
    if (stored === 'en' || stored === 'es') {
      return stored;
    }
  } catch (error) {
    console.error('Error reading locale from localStorage:', error);
  }

  return null;
}

/**
 * Save locale preference to localStorage
 * @param locale - The locale to save
 */
export function setStoredLocale(locale: Locale): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem('easy-attest-locale', locale);
  } catch (error) {
    console.error('Error saving locale to localStorage:', error);
  }
}

/**
 * Create a translation function for a specific locale
 * @param translations - The translations object
 * @param locale - The current locale
 * @returns A function that translates keys
 */
export function createTranslationFunction(
  translations: Translations,
  locale: Locale
): (key: string) => string {
  return (key: string) => {
    return getNestedValue(translations, key);
  };
}
