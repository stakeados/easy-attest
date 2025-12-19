'use client';

import { useState } from 'react';
import { HelpIcon } from './help-icon';
import { useTranslation } from '@/contexts/i18n-context';

interface SchemaSuccessProps {
  schemaUID: string;
  txHash: string;
  onCreateAnother: () => void;
}

export function SchemaSuccess({
  schemaUID,
  txHash,
  onCreateAnother,
}: SchemaSuccessProps) {
  const { t } = useTranslation();
  const [copiedUID, setCopiedUID] = useState(false);
  const [copiedTx, setCopiedTx] = useState(false);

  const handleCopyUID = async () => {
    try {
      await navigator.clipboard.writeText(schemaUID);
      setCopiedUID(true);
      setTimeout(() => setCopiedUID(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyTx = async () => {
    try {
      await navigator.clipboard.writeText(txHash);
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const blockExplorerUrl = `https://basescan.org/tx/${txHash}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t('schema.success.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {t('schema.success.message')}
        </p>
      </div>

      {/* Schema UID Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('schema.success.schemaUid')} <HelpIcon content={t('tooltips.schemaUid')} />
        </label>
        <div className="flex gap-2">
          <div className="flex-1 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <code className="text-sm font-mono break-all text-gray-800 dark:text-gray-200">
              {schemaUID}
            </code>
          </div>
          <button
            onClick={handleCopyUID}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
            title={t('attestation.success.copy')}
          >
            {copiedUID ? (
              <>
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
              </>
            ) : (
              <>
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
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t('schema.success.uidHelper')}
        </p>
      </div>

      {/* Transaction Hash Section */}
      {txHash && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('attestation.success.transactionHash')} <HelpIcon content={t('tooltips.attestationUid')} />
          </label>
          <div className="flex gap-2">
            <div className="flex-1 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <code className="text-sm font-mono break-all text-gray-800 dark:text-gray-200">
                {txHash}
              </code>
            </div>
            <button
              onClick={handleCopyTx}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 whitespace-nowrap"
              title={t('attestation.success.copy')}
            >
              {copiedTx ? (
                <>
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
                </>
              ) : (
                <>
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
                </>
              )}
            </button>
          </div>
          <a
            href={blockExplorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            {t('schema.success.viewOnBasescan')}
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
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-4">
        <button
          onClick={onCreateAnother}
          className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {t('schema.success.createAnother')}
        </button>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex gap-3">
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
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
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              {t('schema.success.whatsNext')}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {t('schema.success.nextSteps')}
            </p>
          </div>
        </div>
      </div>
      {/* Share Section */}
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg space-y-3">
        <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-100">
          {t('attestation.success.share')}
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {/* Share to X (Twitter) */}
          <a
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(`${t('schema.success.shareMessage') || 'I just created a new Schema on Base utilizing Easy Attest! 🛡️✨'}\n\nSchema UID: ${schemaUID}`)}&url=${encodeURIComponent('https://easyattest.xyz')}`}
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
