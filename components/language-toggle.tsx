'use client';

import { useTranslation } from '@/contexts/i18n-context';
import { Locale } from '@/lib/i18n';

export function LanguageToggle() {
  const { locale, setLocale, t } = useTranslation();

  const toggleLanguage = () => {
    const newLocale: Locale = locale === 'en' ? 'es' : 'en';
    setLocale(newLocale);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleLanguage();
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      onKeyDown={handleKeyDown}
      className="relative inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label={t('tooltips.language')}
      title={t('tooltips.language')}
      type="button"
    >
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
        {locale === 'en' ? 'EN' : 'ES'}
      </span>
      <svg
        className="w-4 h-4 text-gray-500 dark:text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
    </button>
  );
}
