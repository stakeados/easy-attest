'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAccount } from 'wagmi';
import { useSearchParams } from 'next/navigation';
import { WalletConnection } from '@/components/wallet-connection';
import { useEAS } from '@/hooks/use-eas';
import { useToast } from '@/components/toast';
import { parseSchemaString, type SchemaField } from '@/lib/eas';
import { useTranslation } from '@/contexts/i18n-context';

// Lazy load heavy components
const SchemaBuilder = dynamic(() => import('@/components/schema-builder').then(mod => ({ default: mod.SchemaBuilder })), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
      <div className="h-12 bg-gray-200 rounded w-1/4"></div>
    </div>
  ),
});

const SchemaSuccess = dynamic(() => import('@/components/schema-success').then(mod => ({ default: mod.SchemaSuccess })), {
  ssr: false,
});

interface RegistrationResult {
  schemaUID: string;
  txHash: string;
}

export default function CreateSchemaPage() {
  const { isConnected } = useAccount();
  const searchParams = useSearchParams();
  const { registerSchema, isLoading, error } = useEAS();
  const [result, setResult] = useState<RegistrationResult | null>(null);
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const { showToast, ToastContainer } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (fields: SchemaField[], revocable: boolean) => {
    setTxStatus('pending');
    setResult(null);

    try {
      showToast('Transaction submitted. Please wait...', 'info');
      const { schemaUID, txHash } = await registerSchema(fields, revocable);
      setResult({ schemaUID, txHash });
      setTxStatus('success');
      showToast('Schema registered successfully!', 'success');
    } catch (err) {
      setTxStatus('error');
      showToast('Failed to register schema', 'error');
      throw err;
    }
  };

  const handleCreateAnother = () => {
    setResult(null);
    setTxStatus('idle');
  };

  if (!isConnected) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {t('schema.create.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t('schema.create.connectWalletMessage')}
              </p>
            </div>
            <WalletConnection />
          </div>
        </div>
        <ToastContainer />
      </>
    );
  }

  if (result && txStatus === 'success') {
    return (
      <>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <SchemaSuccess
              schemaUID={result.schemaUID}
              txHash={result.txHash}
              onCreateAnother={handleCreateAnother}
            />
          </div>
        </div>
        <ToastContainer />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            {/* Transaction Status Notification */}
            {txStatus === 'pending' && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg
                    className="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      {t('schema.create.transactionPending')}
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      {t('schema.create.transactionPendingMessage')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {txStatus === 'error' && error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900 dark:text-red-100">
                      {error.message}
                    </p>
                    {error.details && (
                      <p className="text-xs text-red-700 dark:text-red-300 mt-1">{error.details}</p>
                    )}
                    {error.code === 'INSUFFICIENT_FUNDS' && (
                      <a
                        href="https://bridge.base.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-red-600 dark:text-red-400 underline mt-2 inline-block"
                      >
                        Bridge ETH to Base →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            <SchemaBuilder
              onSubmit={handleSubmit}
              isLoading={isLoading}
              initialFields={parseSchemaString(searchParams.get('schemaString') || '')}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
