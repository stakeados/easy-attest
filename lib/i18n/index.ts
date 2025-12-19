export { en } from './translations/en';
export { es } from './translations/es';
export type { Locale, Translations } from './types';
export {
  getNestedValue,
  detectBrowserLocale,
  getStoredLocale,
  setStoredLocale,
  createTranslationFunction,
} from './utils';
