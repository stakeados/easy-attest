'use client';

import { useState } from 'react';
import { Coffee, Copy, Check } from 'lucide-react';
import { useTranslation } from '@/contexts/i18n-context';

export function Footer() {
    const [copied, setCopied] = useState(false);
    const { t } = useTranslation();
    const donationAddress = 'easy-attest.base.eth';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(donationAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <footer className="w-full py-6 px-4 border-t border-gray-200 dark:border-white/10 mt-auto bg-gray-50 dark:bg-black/20 backdrop-blur-sm transition-colors duration-200">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">

                <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                    <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 px-0">
                        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left flex items-center gap-1 flex-wrap justify-center">
                            {t('footer.builtWith')}{' '}
                            <a
                                href="https://zora.co/@stakeados"
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium underline underline-offset-4 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                Stakeados
                            </a>
                            {' '}{t('footer.forCommunity')}
                            <a
                                href="https://github.com/stakeados/easy-attest"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center ml-2 hover:text-gray-900 dark:hover:text-white transition-colors"
                                aria-label="GitHub Repository"
                            >
                                <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                                </svg>
                            </a>
                        </p>
                    </div>
                </div>
                {/* Right Side: Donation/Support */}
                <button
                    onClick={handleCopy}
                    className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:border-blue-500/30 hover:bg-gray-100 dark:hover:bg-white/10 transition-all cursor-pointer shadow-sm dark:shadow-none"
                    title="Click to copy ENS"
                >
                    <Coffee className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">{t('footer.support')}</span>
                    <span className="font-mono text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{donationAddress}</span>
                    {copied ? (
                        <Check className="w-3 h-3 text-green-600 dark:text-green-500" />
                    ) : (
                        <Copy className="w-3 h-3 text-gray-400 dark:opacity-50 group-hover:text-gray-600 dark:group-hover:opacity-100" />
                    )}
                </button>

            </div>
        </footer>
    );
}
