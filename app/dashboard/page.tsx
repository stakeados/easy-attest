'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { type FilterOptions } from '@/components/attestation-filters';
import { useAttestations } from '@/hooks/use-attestations';
import { querySchemas } from '@/lib/subgraph';
import { parseSchemaString } from '@/lib/eas';
import { useSwipe } from '@/hooks/use-swipe';
import { useTranslation } from '@/contexts/i18n-context';

// Lazy load heavy components
const AttestationList = dynamic(() => import('@/components/attestation-list').then(mod => ({ default: mod.AttestationList })), {
  loading: () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-32"></div>
      ))}
    </div>
  ),
});

const AttestationFilters = dynamic(() => import('@/components/attestation-filters').then(mod => ({ default: mod.AttestationFilters })), {
  loading: () => (
    <div className="animate-pulse space-y-4 mb-6">
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  ),
});

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();

  const activeTab = (searchParams.get('tab') || 'received') as 'received' | 'given';

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterOptions>({
    schemaUID: searchParams.get('schemaUID') || undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    sortBy: (searchParams.get('sortBy') as FilterOptions['sortBy']) || 'date-desc',
  });

  const [availableSchemas, setAvailableSchemas] = useState<Array<{ uid: string; name: string }>>([]);

  // Fetch attestations based on active tab and filters
  const { attestations, isLoading, error, retry } = useAttestations({
    address,
    type: activeTab,
    ...filters,
  });

  // Fetch available schemas for filter dropdown
  useEffect(() => {
    async function fetchSchemas() {
      try {
        const schemas = await querySchemas({ first: 50 });
        const schemaOptions = schemas.map((schema) => {
          const fields = parseSchemaString(schema.schema);
          const name = fields.length > 0
            ? fields.map(f => f.name).join(', ')
            : schema.id.slice(0, 10) + '...';
          return {
            uid: schema.id,
            name,
          };
        });
        setAvailableSchemas(schemaOptions);
      } catch (err) {
        console.error('Failed to fetch schemas:', err);
      }
    }
    fetchSchemas();
  }, []);

  const handleTabChange = (tab: 'received' | 'given') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.push(`/dashboard?${params.toString()}`);
  };

  // Swipe gesture handlers for tab navigation
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      if (activeTab === 'received') {
        handleTabChange('given');
      }
    },
    onSwipeRight: () => {
      if (activeTab === 'given') {
        handleTabChange('received');
      }
    },
    minSwipeDistance: 75,
  });

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);

    // Update URL params
    const params = new URLSearchParams(searchParams.toString());
    if (newFilters.schemaUID) {
      params.set('schemaUID', newFilters.schemaUID);
    } else {
      params.delete('schemaUID');
    }
    if (newFilters.startDate) {
      params.set('startDate', newFilters.startDate);
    } else {
      params.delete('startDate');
    }
    if (newFilters.endDate) {
      params.set('endDate', newFilters.endDate);
    } else {
      params.delete('endDate');
    }
    params.set('sortBy', newFilters.sortBy);

    router.push(`/dashboard?${params.toString()}`);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t('dashboard.connectWallet')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('dashboard.connectWalletMessage')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('dashboard.title')}
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
            <nav className="flex -mb-px">
              <button
                onClick={() => handleTabChange('received')}
                className={`
                  flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium border-b-2 transition-colors whitespace-nowrap min-h-[44px]
                  ${activeTab === 'received'
                    ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <span className="hidden sm:inline">{t('dashboard.attestationsReceived')}</span>
                <span className="sm:hidden">{t('dashboard.received')}</span>
              </button>
              <button
                onClick={() => handleTabChange('given')}
                className={`
                  flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium border-b-2 transition-colors whitespace-nowrap min-h-[44px]
                  ${activeTab === 'given'
                    ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <span className="hidden sm:inline">{t('dashboard.attestationsGiven')}</span>
                <span className="sm:hidden">{t('dashboard.given')}</span>
              </button>
            </nav>
          </div>

          {/* Tab Content with Swipe Support */}
          <div
            className="p-3 sm:p-6"
            {...swipeHandlers}
          >
            <AttestationFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              availableSchemas={availableSchemas}
            />

            {error && (
              <div className="mb-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                  <button
                    onClick={retry}
                    className="min-h-[44px] px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 whitespace-nowrap"
                  >
                    {t('common.retry')}
                  </button>
                </div>
              </div>
            )}

            <AttestationList
              attestations={attestations}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
