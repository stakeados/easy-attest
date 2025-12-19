'use client';

import { useTranslation } from '@/contexts/i18n-context';

export type EmptyStateStatus = 'loading' | 'no-schemas' | 'subgraph-unavailable' | 'subgraph-indexing';

interface SchemaDiscoveryEmptyStateProps {
  status: EmptyStateStatus;
  onRetry?: () => void;
}

export function SchemaDiscoveryEmptyState({ status, onRetry }: SchemaDiscoveryEmptyStateProps) {
  const { t } = useTranslation();

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {t('schema.discovery.loading')}
        </p>
      </div>
    );
  }

  if (status === 'no-schemas') {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('schema.discovery.noSchemas')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            {t('schema.discovery.noSchemasMessage')}
          </p>
        </div>
        <a
          href="/schema/create"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('navigation.createSchema')}
        </a>
      </div>
    );
  }

  if (status === 'subgraph-unavailable') {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('schema.discovery.subgraphUnavailable')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            {t('schema.discovery.subgraphUnavailableMessage')}
          </p>
        </div>
        <div className="flex gap-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('common.retry')}
            </button>
          )}
          <a
            href="https://github.com/yourusername/easy-attest/blob/main/SUBGRAPH_SETUP.md"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            {t('schema.discovery.learnMore')}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  if (status === 'subgraph-indexing') {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-yellow-600 dark:text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="absolute inset-0 border-4 border-yellow-300 dark:border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('schema.discovery.subgraphIndexing')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            {t('schema.discovery.subgraphIndexingMessage')}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('common.retry')}
          </button>
        )}
      </div>
    );
  }

  return null;
}
