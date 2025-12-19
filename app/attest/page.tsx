'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useAccount } from 'wagmi';
import { useSearchParams } from 'next/navigation';
import { WalletConnection } from '@/components/wallet-connection';
import { useEAS } from '@/hooks/use-eas';
import { generateSchemaString, type SchemaField } from '@/lib/eas';
import { useToast } from '@/components/toast';
import { useTranslation } from '@/contexts/i18n-context';
import { STANDARD_SCHEMAS } from '@/lib/config/standard-schemas';

// Lazy load heavy components
const SchemaSelector = dynamic(() => import('@/components/schema-selector').then(mod => ({ default: mod.SchemaSelector })), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-12 bg-gray-200 rounded"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  ),
});

const AttestationForm = dynamic(() => import('@/components/attestation-form').then(mod => ({ default: mod.AttestationForm })), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
      <div className="h-12 bg-gray-200 rounded w-1/4"></div>
    </div>
  ),
});

const AttestationSuccess = dynamic(() => import('@/components/attestation-success').then(mod => ({ default: mod.AttestationSuccess })), {
  ssr: false,
});

type PageState = 'select' | 'form' | 'success';

function AttestPageContent() {
  const { isConnected } = useAccount();
  const { createAttestation, fetchSchema, isLoading, isReady, logs } = useEAS();
  const searchParams = useSearchParams();
  const { showToast, ToastContainer } = useToast();
  const { t } = useTranslation();

  const [pageState, setPageState] = useState<PageState>('select');
  const [selectedSchemaUID, setSelectedSchemaUID] = useState('');
  const [selectedFields, setSelectedFields] = useState<SchemaField[]>([]);
  const [isRevocable, setIsRevocable] = useState(true);
  const [attestationUID, setAttestationUID] = useState('');
  const [txHash, setTxHash] = useState('');

  // Find standard schema info if available
  const standardSchema = STANDARD_SCHEMAS.find(s => s.uid === selectedSchemaUID);
  const schemaName = standardSchema ? t(`schema.template.${standardSchema.id}.title`) : undefined;
  const schemaDescription = standardSchema ? t(`schema.template.${standardSchema.id}.description`) : undefined;

  const schemaAttempted = useRef<string | null>(null);

  // Check for schema parameter in URL
  useEffect(() => {
    const schemaParam = searchParams.get('schema');

    // Reset attempted ref if URL param changes to something new (navigation)
    if (schemaParam && schemaAttempted.current !== schemaParam) {
      // Allow a new attempt for a new param
    } else if (!schemaParam) {
      schemaAttempted.current = null;
    }

    if (schemaParam && isReady && schemaParam !== selectedSchemaUID && schemaAttempted.current !== schemaParam) {
      // Mark as attempted to prevent infinite loop
      schemaAttempted.current = schemaParam;

      // Auto-load schema from URL parameter
      fetchSchema(schemaParam).then((result) => {
        if (result && result.fields.length > 0) {
          setSelectedSchemaUID(schemaParam);
          setSelectedFields(result.fields);
          setIsRevocable(result.revocable);
          setPageState('form');
        } else {
          console.error('Failed to load schema details for:', schemaParam);
          showToast(t('errors.schemaLoadFailed') || 'Failed to load schema details. Please check the UID.', 'error');
        }
      });
    }
  }, [searchParams, isReady, fetchSchema, selectedSchemaUID, showToast, t]);

  const handleSchemaSelect = (schemaUID: string, fields: SchemaField[], revocable: boolean) => {
    setSelectedSchemaUID(schemaUID);
    setSelectedFields(fields);
    setIsRevocable(revocable);
    setPageState('form');
  };

  const handleAttestationSubmit = async (data: {
    recipient: string;
    data: Record<string, any>;
  }) => {
    try {
      showToast('Transaction pending...', 'info');

      const schemaString = generateSchemaString(selectedFields);
      const result = await createAttestation(
        {
          schemaUID: selectedSchemaUID,
          recipient: data.recipient,
          data: data.data,
          revocable: isRevocable,
        },
        schemaString
      );

      setAttestationUID(result.attestationUID);
      setTxHash(result.txHash);
      setPageState('success');

      showToast('Attestation created successfully!', 'success');
    } catch (error: any) {
      console.error('Attestation creation failed:', error);

      if (error.code === 'USER_REJECTED') {
        showToast('Transaction was rejected', 'error');
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        showToast(
          'Insufficient funds for gas. Please add ETH to your wallet.',
          'error'
        );
      } else {
        showToast(
          error.message || 'Failed to create attestation',
          'error'
        );
      }
    }
  };

  const handleCreateAnother = () => {
    setPageState('select');
    setSelectedSchemaUID('');
    setSelectedFields([]);
    setAttestationUID('');
    setTxHash('');
  };

  if (!isConnected) {
    return (
      <>
        <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
          <div className="w-full max-w-md space-y-6 text-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {t('attestation.form.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t('attestation.form.connectWalletMessage')}
              </p>
            </div>
            <div className="flex justify-center">
              <WalletConnection />
            </div>
          </div>
        </main>
        <ToastContainer />
      </>
    );
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-3xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              {t('attestation.form.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('attestation.form.subtitle')}
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            {pageState === 'select' && (
              <SchemaSelector
                onSchemaSelect={handleSchemaSelect}
                onFetchSchema={fetchSchema}
                isLoading={isLoading}
              />
            )}

            {pageState === 'form' && (
              <div className="space-y-4">
                <button
                  onClick={() => window.location.href = '/schemas'}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  {t('attestation.form.changeSchema')}
                </button>
                <AttestationForm
                  schemaUID={selectedSchemaUID}
                  fields={selectedFields}
                  onSubmit={handleAttestationSubmit}
                  isLoading={isLoading}
                  schemaName={schemaName}
                  schemaDescription={schemaDescription}
                />
              </div>
            )}

            {pageState === 'success' && (
              <AttestationSuccess
                attestationUID={attestationUID}
                txHash={txHash}
                onCreateAnother={handleCreateAnother}
              />
            )}


          </div>
        </div>
      </main>
      <ToastContainer />
    </>
  );
}

export default function AttestPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
        </div>
      </main>
    }>
      <AttestPageContent />
    </Suspense>
  );
}
