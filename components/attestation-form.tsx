'use client';

import { useState, useEffect } from 'react';
import type { SchemaField } from '@/lib/eas';
import { AddressDisplay } from './address-display';
import { HelpIcon } from './help-icon';
import { type Address, isAddress } from 'viem';
import { useTranslation } from '@/contexts/i18n-context';

interface AttestationFormProps {
  schemaUID: string;
  fields: SchemaField[];
  onSubmit: (data: { recipient: string; data: Record<string, any> }) => Promise<void>;
  isLoading?: boolean;
  schemaName?: string;
  schemaDescription?: string;
}

interface FieldValue {
  value: any;
  error?: string;
}

export function AttestationForm({
  schemaUID,
  fields,
  onSubmit,
  isLoading = false,
  schemaName,
  schemaDescription,
}: AttestationFormProps) {
  const { t } = useTranslation();
  const [recipient, setRecipient] = useState('');
  const [recipientError, setRecipientError] = useState('');
  const [fieldValues, setFieldValues] = useState<Record<string, FieldValue>>({});
  const [formError, setFormError] = useState('');

  // Initialize field values
  useEffect(() => {
    const initialValues: Record<string, FieldValue> = {};
    fields.forEach((field) => {
      initialValues[field.name] = { value: getDefaultValue(field.type) };
    });
    setFieldValues(initialValues);
  }, [fields]);

  const getDefaultValue = (type: SchemaField['type']) => {
    switch (type) {
      case 'bool':
        return false;
      case 'uint256':
        return '';
      case 'string':
      case 'address':
      case 'bytes32':
      case 'bytes':
      default:
        return '';
    }
  };

  const validateRecipient = (address: string): boolean => {
    if (!address.trim()) {
      setRecipientError(t('attestation.form.recipientRequired'));
      return false;
    }

    if (!isAddress(address)) {
      setRecipientError(t('attestation.form.recipientInvalid'));
      return false;
    }

    setRecipientError('');
    return true;
  };

  const validateField = (field: SchemaField, value: any): string | undefined => {
    // Check required fields
    if (field.required && (value === '' || value === null || value === undefined)) {
      return `${field.name} ${t('attestation.form.fieldRequired')}`;
    }

    // Type-specific validation
    switch (field.type) {
      case 'address':
        if (value && !isAddress(value)) {
          return t('attestation.form.recipientInvalid');
        }
        break;
      case 'uint256':
        if (value !== '' && (isNaN(Number(value)) || Number(value) < 0)) {
          return t('attestation.form.mustBePositiveNumber');
        }
        break;
      case 'bool':
        // Boolean is always valid
        break;
      case 'string':
        // String is always valid
        break;
      case 'bytes32':
        if (value && !/^0x[a-fA-F0-9]{64}$/.test(value)) {
          return t('attestation.form.hexLengthError');
        }
        break;
      case 'bytes':
        if (value && !/^0x[a-fA-F0-9]*$/.test(value)) {
          return t('attestation.form.mustBeValidHex');
        }
        break;
    }

    return undefined;
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    const field = fields.find((f) => f.name === fieldName);
    if (!field) return;

    // Real-time validation
    const error = validateField(field, value);
    setFieldValues({
      ...fieldValues,
      [fieldName]: { value, error },
    });
    setFormError('');
  };

  const handleRecipientChange = (value: string) => {
    setRecipient(value);

    // Real-time validation for recipient
    if (value.trim() && !isAddress(value)) {
      setRecipientError(t('attestation.form.recipientInvalid'));
    } else {
      setRecipientError('');
    }

    setFormError('');
  };

  const validateAllFields = (): boolean => {
    let isValid = true;
    const newFieldValues = { ...fieldValues };

    fields.forEach((field) => {
      const value = fieldValues[field.name]?.value;
      const error = validateField(field, value);
      if (error) {
        newFieldValues[field.name] = { value, error };
        isValid = false;
      }
    });

    setFieldValues(newFieldValues);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validate recipient
    if (!validateRecipient(recipient)) {
      setFormError(t('attestation.form.fixErrors'));
      return;
    }

    // Validate all fields
    if (!validateAllFields()) {
      setFormError(t('attestation.form.fixErrors'));
      return;
    }

    // Prepare attestation data
    const attestationData: Record<string, any> = {};
    fields.forEach((field) => {
      let value = fieldValues[field.name]?.value;

      // Convert values to appropriate types
      if (field.type === 'uint256' && value !== '') {
        value = BigInt(value);
      } else if (field.type === 'bool') {
        value = Boolean(value);
      }

      attestationData[field.name] = value;
    });

    try {
      await onSubmit({ recipient, data: attestationData });
    } catch (error) {
      console.error('Attestation submission error:', error);
    }
  };

  const renderFieldInput = (field: SchemaField) => {
    const fieldValue = fieldValues[field.name];
    const value = fieldValue?.value ?? getDefaultValue(field.type);
    const error = fieldValue?.error;

    // Get translated field name
    // @ts-ignore - dynamic key access
    const translatedName = t(`schema.fields.${field.name}`);
    const displayName = translatedName.startsWith('schema.fields.') ? field.name : translatedName;

    switch (field.type) {
      case 'bool':
        return (
          <div className="flex items-center gap-3 min-h-[44px]">
            <input
              type="checkbox"
              id={field.name}
              checked={value}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              disabled={isLoading}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={field.name} className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
              {field.required && <span className="text-red-500 mr-1">*</span>}
              {displayName}
            </label>
          </div>
        );

      case 'uint256':
        // Check if it's a date field
        if (field.name.toLowerCase().match(/(date|time|expiration|deadline|timestamp)/)) {
          // Convert generic timestamp to ISO string for input
          // Convert generic timestamp to ISO string for input
          let dateValue = '';
          try {
            if (value && !isNaN(Number(value))) {
              const date = new Date(Number(value) * 1000);
              if (!isNaN(date.getTime())) {
                dateValue = date.toISOString().slice(0, 16);
              }
            }
          } catch (e) {
            // Ignore invalid dates during typing
          }

          return (
            <div className="space-y-1">
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {field.required && <span className="text-red-500 mr-1">*</span>}
                {displayName}
              </label>
              <input
                type="datetime-local"
                id={field.name}
                value={dateValue}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  const timestamp = Math.floor(date.getTime() / 1000);
                  handleFieldChange(field.name, timestamp.toString());
                }}
                disabled={isLoading}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-base min-h-[44px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('attestation.form.dateHelper')}
              </p>
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            </div>
          );
        }

        // Check if it's a percentage field
        const isPercentage = field.name.toLowerCase().match(/(rate|percent|fee|interest)/);

        return (
          <div className="space-y-1">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.required && <span className="text-red-500 mr-1">*</span>}
              {displayName}
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                id={field.name}
                value={value}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                disabled={isLoading}
                min="0"
                step="1"
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-base min-h-[44px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder={t('attestation.form.enterNumber')}
              />
              {isPercentage && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">%</span>
                </div>
              )}
            </div>
            {isPercentage && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('attestation.form.percentageHelper')}
              </p>
            )}
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          </div>
        );

      case 'address':
        return (
          <div className="space-y-1">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.required && <span className="text-red-500 mr-1">*</span>}
              {displayName}
            </label>
            <input
              type="text"
              inputMode="text"
              id={field.name}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              disabled={isLoading}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed font-mono text-sm min-h-[44px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              placeholder="0x..."
            />
            {value && isAddress(value) && !error && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <AddressDisplay address={value as Address} />
              </div>
            )}
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          </div>
        );

      case 'string':
      default:
        return (
          <div className="space-y-1">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.required && <span className="text-red-500 mr-1">*</span>}
              {displayName}
            </label>
            <input
              type="text"
              inputMode="text"
              id={field.name}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              disabled={isLoading}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-base min-h-[44px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              placeholder={`${t('attestation.form.enterValue')} ${displayName}`}
            />
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {schemaName || t('attestation.form.title')}
        </h2>
        <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {schemaDescription || t('attestation.form.subtitle')}
        </p>
        <div className="mt-2 p-2 sm:p-3 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            {t('attestation.form.schemaUID')}: <HelpIcon content={t('attestation.form.schemaUIDTooltip')} position="right" />
          </div>
          <div className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all">{schemaUID}</div>
        </div>
      </div>

      {/* Recipient Address */}
      <div className="space-y-1">
        <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <span className="text-red-500 mr-1">*</span>
          {t('attestation.form.recipient')} <HelpIcon content={t('attestation.form.recipientTooltip')} />
        </label>
        <input
          type="text"
          id="recipient"
          inputMode="text"
          value={recipient}
          onChange={(e) => handleRecipientChange(e.target.value)}
          disabled={isLoading}
          className={`w-full px-3 sm:px-4 py-2.5 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed font-mono text-sm min-h-[44px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${recipientError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          placeholder={t('attestation.form.recipientPlaceholder')}
        />
        {recipient && isAddress(recipient) && !recipientError && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <AddressDisplay address={recipient as Address} />
          </div>
        )}
        {recipientError && <p className="text-sm text-red-600 dark:text-red-400">{recipientError}</p>}
      </div>

      {/* Attestation Fields */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">{t('attestation.form.schemaData')}</h3>
        <div className="space-y-3 sm:space-y-4">
          {fields.map((field) => (
            <div key={field.name}>{renderFieldInput(field)}</div>
          ))}
        </div>
      </div>

      {/* Form Error */}
      {formError && (
        <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-400">{formError}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-stretch sm:justify-end">
        <button
          type="submit"
          disabled={
            isLoading ||
            !!recipientError ||
            Object.values(fieldValues).some((fv) => !!fv.error)
          }
          className="w-full sm:w-auto min-h-[44px] px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
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
              {t('attestation.form.creating')}
            </span>
          ) : (
            t('attestation.form.submit')
          )}
        </button>
      </div>
    </form>
  );
}
