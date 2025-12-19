'use client';

import { useState } from 'react';
import Link from 'next/link';
import { WalletConnection } from '@/components/wallet-connection';
import { NetworkSwitchPrompt } from '@/components/network-switch-prompt';
import { WalletReconnectPrompt } from '@/components/wallet-reconnect-prompt';
import { PreferencesControls } from '@/components/preferences-controls';
import { useTranslation } from '@/contexts/i18n-context';
import { useSchemaPrefetch } from '@/hooks/use-schema-prefetch';
import { Footer } from '@/components/footer';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  // Prefetch common schemas for better performance
  useSchemaPrefetch();

  return (
    <>
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-8 flex-1">
              <Link
                href="/"
                className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Easy Attest
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-4 lg:gap-6">
                <Link
                  href="/schemas"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap"
                >
                  {t('navigation.discoverSchemas')}
                </Link>
                <Link
                  href="/schema/create"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap"
                >
                  {t('navigation.createSchema')}
                </Link>
                <Link
                  href="/attest"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap"
                >
                  {t('navigation.createAttestation')}
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap"
                >
                  {t('navigation.dashboard')}
                </Link>
                <Link
                  href="/docs"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap"
                >
                  {t('navigation.docs')}
                </Link>
              </nav>
            </div>

            {/* Preferences & Wallet */}
            <div className="flex items-center gap-2 sm:gap-4">
              <PreferencesControls />
              <div className="hidden sm:block">
                <WalletConnection />
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-2 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="sm:hidden mb-4">
                <WalletConnection />
              </div>
              <Link
                href="/schemas"
                className="block px-4 py-3 text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[44px] flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('navigation.discoverSchemas')}
              </Link>
              <Link
                href="/schema/create"
                className="block px-4 py-3 text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[44px] flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('navigation.createSchema')}
              </Link>
              <Link
                href="/attest"
                className="block px-4 py-3 text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[44px] flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('navigation.createAttestation')}
              </Link>
              <Link
                href="/dashboard"
                className="block px-4 py-3 text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[44px] flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('navigation.dashboard')}
              </Link>
              <Link
                href="/docs"
                className="block px-4 py-3 text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[44px] flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('navigation.docs')}
              </Link>
            </nav>
          )}
        </div>
      </header>
      <NetworkSwitchPrompt />
      <WalletReconnectPrompt />
      {children}
      <Footer />
    </>
  );
}
