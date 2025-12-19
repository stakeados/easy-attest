'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tooltip } from './tooltip';
import { useTranslation } from '@/contexts/i18n-context';

interface AttestationSuccessProps {
  attestationUID: string;
  txHash: string;
  onCreateAnother: () => void;
}

export function AttestationSuccess({
  attestationUID,
  txHash,
  onCreateAnother,
}: AttestationSuccessProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(attestationUID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const blockExplorerUrl = `https://basescan.org/tx/${txHash}`;

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('attestation.success.title')}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {t('attestation.success.message')}
          </p>
        </div>
      </div>

      {/* Attestation UID */}
      <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-green-900 dark:text-green-100">
              {t('attestation.success.attestationUid')}
            </h3>
            <Tooltip content={t('attestation.success.attestationUidTooltip')}>
              <svg
                className="w-4 h-4 text-green-700 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Tooltip>
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-sm font-medium text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200 hover:bg-green-100 dark:hover:bg-green-800/30 rounded transition-colors"
          >
            {copied ? (
              <span className="flex items-center gap-1">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {t('attestation.success.copied')}
              </span>
            ) : (
              <span className="flex items-center gap-1">
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
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                {t('attestation.success.copy')}
              </span>
            )}
          </button>
        </div>
        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-green-200 dark:border-green-700">
          <p className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
            {attestationUID === '' || attestationUID === '0x0000000000000000000000000000000000000000000000000000000000000000'
              ? t('attestation.success.pendingUid') || 'Pending... (Check Transaction)'
              : attestationUID}
          </p>
        </div>
      </div>

      {/* Transaction Hash & Basescan Link */}
      <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
            {t('attestation.success.transactionHash')}
          </h3>
          <Tooltip content={t('attestation.success.transactionHashTooltip')}>
            <svg
              className="w-4 h-4 text-blue-700 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </Tooltip>
        </div>
        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-blue-200 dark:border-blue-700">
          <p className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
            {txHash}
          </p>
        </div>
        <Tooltip content={t('attestation.success.basescanTooltip')} position="bottom">
          <a
            href={blockExplorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-3 bg-blue-600 dark:bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors w-full justify-center"
          >
            <span>{t('attestation.success.viewOnBasescan')}</span>
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
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </Tooltip>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onCreateAnother}
          className="flex-1 px-6 py-3 bg-green-600 dark:bg-green-700 text-white font-medium rounded-lg hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
        >
          {t('attestation.success.createAnother')}
        </button>
        <Link
          href="/"
          className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors text-center"
        >
          {t('attestation.success.backToHome')}
        </Link>
      </div>

      {/* Share Section */}
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg space-y-3">
        <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-100">
          {t('attestation.success.share')}
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {/* Share to X (Twitter) */}
          <a
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(`${t('attestation.success.shareMessage')}\n\nProof: https://basescan.org/tx/${txHash}`)}&url=${encodeURIComponent('https://easyattest.xyz')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
            {t('attestation.success.shareToX')}
          </a>
        </div>
      </div>
    </div>
  );
}
