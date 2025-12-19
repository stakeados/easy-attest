'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { querySchemas, type SubgraphSchema } from '@/lib/subgraph';
import { parseSchemaString } from '@/lib/eas';
import { AddressDisplay } from '@/components/address-display';
import { useToast } from '@/components/toast';
import { useDebounce } from '@/hooks/use-debounce';
import { type EmptyStateStatus } from '@/components/schema-discovery-empty-state';
import { useTranslation } from '@/contexts/i18n-context';
import { STANDARD_SCHEMAS } from '@/lib/config/standard-schemas';
import { SchemaTemplateCard } from '@/components/schema-template-card';
import { useEAS } from '@/hooks/use-eas';

// Lazy load heavy components
const SchemaDetailModal = dynamic(() => import('@/components/schema-detail-modal').then(mod => ({ default: mod.SchemaDetailModal })), {
  ssr: false,
});

const SchemaDiscoveryEmptyState = dynamic(() => import('@/components/schema-discovery-empty-state').then(mod => ({ default: mod.SchemaDiscoveryEmptyState })), {
  loading: () => (
    <div className="text-center py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto"></div>
        <div className="h-6 bg-gray-200 rounded w-48 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
      </div>
    </div>
  ),
});

type SortOption = 'date-desc' | 'date-asc' | 'popularity-desc' | 'popularity-asc';
type DateFilter = 'all' | 'today' | 'week' | 'month' | 'custom';

export default function SchemasPage() {
  const { showToast, ToastContainer } = useToast();
  const { t } = useTranslation();
  const [schemas, setSchemas] = useState<SubgraphSchema[]>([]);
  const [emptyStateStatus, setEmptyStateStatus] = useState<EmptyStateStatus | null>(null);
  const [viewMode, setViewMode] = useState<'templates' | 'explorer'>('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter states
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [minAttestations, setMinAttestations] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  // Modal state
  const [selectedSchema, setSelectedSchema] = useState<SubgraphSchema | null>(null);

  useEffect(() => {
    loadSchemas();
  }, [sortBy, dateFilter, minAttestations]);

  const getDateRange = (): { startDate?: string; endDate?: string } => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (dateFilter) {
      case 'today':
        return { startDate: today.toISOString() };
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return { startDate: weekAgo.toISOString() };
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return { startDate: monthAgo.toISOString() };
      default:
        return {};
    }
  };

  const loadSchemas = async () => {
    setEmptyStateStatus('loading');

    try {
      const dateRange = getDateRange();
      const [orderBy, orderDirection] = sortBy.includes('date')
        ? ['timestamp' as const, sortBy.split('-')[1] as 'asc' | 'desc']
        : ['attestationCount' as const, sortBy.split('-')[1] as 'asc' | 'desc'];

      const data = await querySchemas({
        first: 100,
        ...dateRange,
        minAttestations: minAttestations > 0 ? minAttestations : undefined,
        orderBy,
        orderDirection,
      });

      setSchemas(data);
      setEmptyStateStatus(data.length === 0 ? 'no-schemas' : null);
    } catch (err: any) {
      console.error('Failed to load schemas:', err);
      // ... error handling ...
      setEmptyStateStatus('subgraph-unavailable');
    }
  };

  const handleSchemaClick = (schema: SubgraphSchema) => {
    setSelectedSchema(schema);
  };

  const getFieldCount = (schemaString: string): number => {
    try {
      const fields = parseSchemaString(schemaString);
      return fields.length;
    } catch {
      return 0;
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Real-time RPC Search Fallback
  const { fetchSchema } = useEAS();
  const [rpcSchema, setRpcSchema] = useState<SubgraphSchema | null>(null);

  useEffect(() => {
    const searchRpc = async () => {
      // Only search if query looks like a UID (0x + 64 hex chars)
      if (!debouncedSearchQuery.startsWith('0x') || debouncedSearchQuery.length !== 66) {
        setRpcSchema(null);
        return;
      }

      // Check if we already have it in the list
      if (schemas.some(s => s.id.toLowerCase() === debouncedSearchQuery.toLowerCase())) {
        return;
      }

      const found = await fetchSchema(debouncedSearchQuery);
      if (found) {
        // Convert to SubgraphSchema format
        const mockSchema: SubgraphSchema = {
          id: debouncedSearchQuery,
          schema: found.fields.map(f => `${f.type} ${f.name}`).join(', '),
          creator: 'Unknown (RPC)', // RPC doesn't return creator easily without events
          attestationCount: 0, // RPC doesn't track this
          timestamp: Math.floor(Date.now() / 1000).toString(), // Mock timestamp
        };
        setRpcSchema(mockSchema);
      } else {
        setRpcSchema(null);
      }
    };

    searchRpc();
  }, [debouncedSearchQuery, schemas, fetchSchema]);

  // Filter schemas based on search query
  const filteredSchemas = useMemo(() => {
    // If we have an RPC schema result, return it (plus any matches)
    const allSchemas = rpcSchema ? [rpcSchema, ...schemas] : schemas;

    if (!debouncedSearchQuery.trim()) {
      return allSchemas;
    }

    const query = debouncedSearchQuery.toLowerCase();
    // Use a Set to avoid duplicates if RPC schema is also in the list (race condition)
    const uniqueIds = new Set<string>();

    return allSchemas.filter((schema) => {
      if (uniqueIds.has(schema.id)) return false;

      // Search by Schema UID
      if (schema.id.toLowerCase().includes(query)) {
        uniqueIds.add(schema.id);
        return true;
      }

      // Search by schema string content
      if (schema.schema.toLowerCase().includes(query)) {
        uniqueIds.add(schema.id);
        return true;
      }

      // Search by creator address
      if (schema.creator.toLowerCase().includes(query)) {
        uniqueIds.add(schema.id);
        return true;
      }

      return false;
    });
  }, [schemas, debouncedSearchQuery, rpcSchema]);

  // Filter templates based on search query and category
  const filteredTemplates = useMemo(() => {
    let templates = STANDARD_SCHEMAS;

    // Filter by Category
    if (selectedCategory !== 'All') {
      templates = templates.filter(t => t.category === selectedCategory);
    }

    if (!debouncedSearchQuery.trim()) {
      return templates;
    }

    const query = debouncedSearchQuery.toLowerCase();
    return templates.filter((template) => {
      const schemaString = template.fields.map(f => `${f.type} ${f.name}`).join(', ');
      return (
        template.title.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        schemaString.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query)
      );
    });
  }, [debouncedSearchQuery, selectedCategory]);

  const categories = ['All', ...Array.from(new Set(STANDARD_SCHEMAS.map(s => s.category)))];

  // Show empty state ONLY if we are in explorer mode and have no schemas
  // We no longer return early here so that Templates are always visible


  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-8">
        <div className="w-full max-w-6xl space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              {t('schema.discovery.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('home.discoverSchemasDescription')}
            </p>
          </div>

          {/* View Mode Tabs */}
          <div className="flex justify-center">
            <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl inline-flex">
              <button
                onClick={() => setViewMode('templates')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'templates'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
              >
                Standard Templates
              </button>
              <button
                onClick={() => setViewMode('explorer')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'explorer'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
              >
                Community Explorer
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
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
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('schema.selector.searchPlaceholder')}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                {showFilters ? t('dashboard.hideFilters') : t('dashboard.showFilters')}
              </button>
              {debouncedSearchQuery && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('schema.discovery.found')} {filteredSchemas.length} {t('schema.discovery.schemas')}
                </p>
              )}
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard.sortBy')}
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="date-desc">{t('dashboard.newestFirst')}</option>
                    <option value="date-asc">{t('dashboard.oldestFirst')}</option>
                    <option value="popularity-desc">{t('dashboard.mostPopular')}</option>
                    <option value="popularity-asc">{t('dashboard.leastPopular')}</option>
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard.created')}
                  </label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="all">{t('dashboard.allTime')}</option>
                    <option value="today">{t('dashboard.today')}</option>
                    <option value="week">{t('dashboard.pastWeek')}</option>
                    <option value="month">{t('dashboard.pastMonth')}</option>
                  </select>
                </div>

                {/* Min Attestations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard.minUses')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minAttestations}
                    onChange={(e) => setMinAttestations(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Templates Grid */}
          {viewMode === 'templates' && (
            <div className="space-y-6">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <SchemaTemplateCard key={template.title} template={template} />
                ))}
                {filteredTemplates.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('schema.selector.noResults')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Schema Grid (Explorer) */}
          {viewMode === 'explorer' && (
            <>
              {emptyStateStatus && schemas.length === 0 ? (
                <SchemaDiscoveryEmptyState
                  status={emptyStateStatus}
                  onRetry={loadSchemas}
                />
              ) : filteredSchemas.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery ? t('schema.selector.noResults') : t('schema.discovery.noSchemas')}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSchemas.map((schema) => (
                    <div
                      key={schema.id}
                      onClick={() => handleSchemaClick(schema)}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500 transition-all cursor-pointer group"
                    >
                      {/* Schema UID (truncated) */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 font-mono truncate">
                          {schema.id}
                        </p>
                      </div>

                      {/* Schema String Preview */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-mono line-clamp-2 break-all">
                          {schema.schema}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between mb-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
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
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span>{getFieldCount(schema.schema)} {t('schema.discovery.fields')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
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
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{schema.attestationCount} {t('schema.discovery.uses')}</span>
                        </div>
                      </div>

                      {/* Creator */}
                      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('schema.discovery.createdBy')}</p>
                        <AddressDisplay address={schema.creator as `0x${string}`} />
                      </div>

                      {/* Date */}
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimestamp(schema.timestamp)}
                        </p>
                        <div className="text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )
          }
        </div>
      </main>
      <ToastContainer />

      {/* Schema Detail Modal */}
      {selectedSchema && (
        <SchemaDetailModal
          schema={selectedSchema}
          onClose={() => setSelectedSchema(null)}
        />
      )}
    </>
  );
}
