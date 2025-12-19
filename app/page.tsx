'use client';

import Link from 'next/link';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useOnboarding } from '@/hooks/use-onboarding';
import { useTranslation } from '@/contexts/i18n-context';

// Lazy load heavy components
const WelcomeModal = dynamic(() => import('@/components/welcome-modal').then(mod => ({ default: mod.WelcomeModal })), {
  ssr: false,
});

const TutorialOverlay = dynamic(() => import('@/components/tutorial-overlay').then(mod => ({ default: mod.TutorialOverlay })), {
  ssr: false,
});

// Import tutorial steps hook
import { useTutorialSteps } from '@/hooks/use-tutorial-steps';

export default function Home() {
  const {
    shouldShowWelcome,
    markWelcomeSeen,
    markSchemaTutorialComplete,
  } = useOnboarding();
  const [showTutorial, setShowTutorial] = useState(false);
  const { t } = useTranslation();
  const { schemaTutorialSteps } = useTutorialSteps();

  const handleStartTutorial = () => {
    markWelcomeSeen();
    setShowTutorial(true);
  };

  const handleSkipWelcome = () => {
    markWelcomeSeen();
  };

  const handleCompleteTutorial = () => {
    markSchemaTutorialComplete();
    setShowTutorial(false);
  };

  const handleSkipTutorial = () => {
    setShowTutorial(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-white dark:bg-gray-950">
      <div className="z-10 w-full max-w-5xl space-y-6 sm:space-y-8">
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            {t('home.title')}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            {t('home.subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-12">
          <Link
            href="/schema/create"
            className="group p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('home.createSchemaTitle')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('home.createSchemaDescription')}
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/attest"
            className="group p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                <svg
                  className="w-8 h-8 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('home.createAttestationTitle')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('home.createAttestationDescription')}
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/dashboard"
            className="group p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-500"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('home.dashboardTitle')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('home.dashboardDescription')}
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/schemas"
            className="group p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-500"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                <svg
                  className="w-8 h-8 text-orange-600 dark:text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('home.discoverSchemasTitle')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('home.discoverSchemasDescription')}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Welcome Modal */}
      {shouldShowWelcome && (
        <WelcomeModal
          onClose={handleSkipWelcome}
          onStartTutorial={handleStartTutorial}
        />
      )}

      {/* Tutorial Overlay */}
      {showTutorial && (
        <TutorialOverlay
          steps={schemaTutorialSteps}
          onComplete={handleCompleteTutorial}
          onSkip={handleSkipTutorial}
        />
      )}
    </main>
  );
}
