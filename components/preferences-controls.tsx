'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';

export function PreferencesControls() {
  return (
    <div
      className="flex items-center gap-2 sm:gap-3"
      role="group"
      aria-label="User preferences"
    >
      {/* Language Toggle */}
      <LanguageToggle />
      
      {/* Visual separator */}
      <div
        className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-gray-600"
        aria-hidden="true"
      />
      
      {/* Theme Toggle */}
      <ThemeToggle />
    </div>
  );
}
