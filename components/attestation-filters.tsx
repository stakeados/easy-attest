'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/i18n-context';

export interface FilterOptions {
  schemaUID?: string;
  startDate?: string;
  endDate?: string;
  sortBy: 'date-desc' | 'date-asc';
}

interface AttestationFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableSchemas?: Array<{ uid: string; name: string }>;
}

export function AttestationFilters({
  filters,
  onFiltersChange,
  availableSchemas = [],
}: AttestationFiltersProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterOptions = {
      sortBy: 'date-desc',
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const hasActiveFilters =
    filters.schemaUID || filters.startDate || filters.endDate;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mb-4 sm:mb-6">
      {/* Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 min-h-[44px]"
          >
            <svg
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            {t('attestation.filters.filters')}
          </button>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full">
              {t('attestation.filters.active')}
            </span>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{t('attestation.filters.sortByLabel')}</label>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                sortBy: e.target.value as FilterOptions['sortBy'],
              })
            }
            className="flex-1 sm:flex-none px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            <option value="date-desc">{t('attestation.filters.newestFirst')}</option>
            <option value="date-asc">{t('attestation.filters.oldestFirst')}</option>
          </select>
        </div>
      </div>

      {/* Expanded Filter Options */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4">
            {/* Schema Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('attestation.filters.schemaLabel')}
              </label>
              <select
                value={localFilters.schemaUID || ''}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    schemaUID: e.target.value || undefined,
                  })
                }
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base min-h-[44px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              >
                <option value="">{t('attestation.filters.allSchemas')}</option>
                {availableSchemas.map((schema) => (
                  <option key={schema.uid} value={schema.uid}>
                    {schema.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('attestation.filters.fromDate')}
              </label>
              <input
                type="date"
                value={localFilters.startDate || ''}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    startDate: e.target.value || undefined,
                  })
                }
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base min-h-[44px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* End Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('attestation.filters.toDate')}
              </label>
              <input
                type="date"
                value={localFilters.endDate || ''}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    endDate: e.target.value || undefined,
                  })
                }
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base min-h-[44px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={handleApplyFilters}
              className="min-h-[44px] px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {t('attestation.filters.apply')}
            </button>
            <button
              onClick={handleResetFilters}
              className="min-h-[44px] px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {t('attestation.filters.reset')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
