'use client';

import { useState, useEffect } from 'react';
import { getAllGlossaryTerms, searchGlossary, type GlossaryTerm } from '@/lib/glossary';
import Link from 'next/link';
import { useTranslation } from '@/contexts/i18n-context';

export default function DocsPage() {
    const { t, locale } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [terms, setTerms] = useState<GlossaryTerm[]>(getAllGlossaryTerms(locale));

    // Update terms when language changes
    useEffect(() => {
        if (searchQuery.trim()) {
            setTerms(searchGlossary(searchQuery, locale));
        } else {
            setTerms(getAllGlossaryTerms(locale));
        }
    }, [locale, searchQuery]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim()) {
            setTerms(searchGlossary(query, locale));
        } else {
            setTerms(getAllGlossaryTerms(locale));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4"
                    >
                        <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        {t('docs.backToHome')}
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">{t('docs.title')}</h1>
                    <p className="mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-400">
                        {t('docs.subtitle')}
                    </p>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder={t('docs.searchPlaceholder')}
                            className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
                </div>

                {/* Terms List */}
                {terms.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">{t('docs.noResults')} &quot;{searchQuery}&quot;</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {terms.map((term) => (
                            <div
                                key={term.term}
                                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                            >
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    {term.term}
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{term.definition}</p>
                                {term.learnMoreUrl && (
                                    <a
                                        href={term.learnMoreUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                    >
                                        {t('docs.learnMore')}
                                        <svg
                                            className="w-4 h-4 ml-1"
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
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        {t('docs.footer')}{' '}
                        <a
                            href="https://docs.attest.sh"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                            {t('docs.easDocumentation')}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
