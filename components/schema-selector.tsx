'use client';

import { useState } from 'react';
import type { SchemaField } from '@/lib/eas';
import { useTranslation } from '@/contexts/i18n-context';

interface SchemaSelectorProps {
  onSchemaSelect: (schemaUID: string, fields: SchemaField[], revocable: boolean) => void;
  onFetchSchema: (schemaUID: string) => Promise<{ fields: SchemaField[], revocable: boolean } | null>;
  isLoading?: boolean;
}

export function SchemaSelector({
  onSchemaSelect,
  onFetchSchema,
  isLoading = false,
}: SchemaSelectorProps) {
  const { t } = useTranslation();
  const [schemaUID, setSchemaUID] = useState('');
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [previewFields, setPreviewFields] = useState<SchemaField[] | null>(null);
  const [isRevocable, setIsRevocable] = useState(true);

  const validateSchemaUID = (uid: string): boolean => {
    // Schema UID should be a 66-character hex string (0x + 64 hex chars)
    const hexPattern = /^0x[a-fA-F0-9]{64}$/;
    return hexPattern.test(uid);
  };

  const handleFetchSchema = async () => {
    setError('');
    setPreviewFields(null);

    if (!schemaUID.trim()) {
      setError(t('attestation.form.enterSchemaUID'));
      return;
    }

    if (!validateSchemaUID(schemaUID)) {
      setError(t('attestation.form.invalidSchemaUID'));
      return;
    }

    setIsFetching(true);

    try {
      const result = await onFetchSchema(schemaUID);

      if (!result || result.fields.length === 0) {
        setError(t('attestation.form.schemaNotFound'));
        setPreviewFields(null);
        return;
      }

      setPreviewFields(result.fields);
      setIsRevocable(result.revocable);
      setError('');
    } catch {
      setError(t('attestation.form.schemaFetchError'));
      setPreviewFields(null);
    } finally {
      setIsFetching(false);
    }
  };

  const handleUseSchema = () => {
    if (previewFields && previewFields.length > 0) {
      onSchemaSelect(schemaUID, previewFields, isRevocable);
    }
  };

  const handleInputChange = (value: string) => {
    setSchemaUID(value);
    setError('');
    setPreviewFields(null);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          {t('attestation.form.selectSchema')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('attestation.form.selectSchemaSubtitle')}
        </p>
      </div>

      {/* Schema UID Input */}
      <div className="space-y-2">
        <label htmlFor="schemaUID" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('attestation.form.schemaUID')}
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            inputMode="text"
            id="schemaUID"
            value={schemaUID}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={t('attestation.form.recipientPlaceholder')}
            disabled={isLoading || isFetching}
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed font-mono text-sm min-h-[44px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
          <button
            type="button"
            onClick={handleFetchSchema}
            disabled={isLoading || isFetching || !schemaUID.trim()}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 sm:py-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isFetching ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
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
                {t('attestation.form.loading')}
              </span>
            ) : (
              t('attestation.form.loadSchema')
            )}
          </button>
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>

      {/* Schema Preview */}
      {previewFields && previewFields.length > 0 && (
        <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-green-900 dark:text-green-100">
                {t('attestation.form.schemaFound')}
              </h4>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                {previewFields.length} {previewFields.length !== 1 ? t('attestation.form.fieldsDetectedPlural') : t('attestation.form.fieldsDetected')}
              </p>
            </div>
            <button
              type="button"
              onClick={handleUseSchema}
              disabled={isLoading}
              className="w-full sm:w-auto min-h-[44px] px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('attestation.form.useThisSchema')}
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-green-900 dark:text-green-100">{t('schema.create.fields')}:</p>
            <div className="space-y-1">
              {previewFields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-xs bg-white dark:bg-gray-800 px-3 py-2 rounded border border-green-200 dark:border-green-800"
                >
                  <span className="font-mono text-green-700 dark:text-green-400">{field.type}</span>
                  <span className="text-gray-400">→</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{field.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
