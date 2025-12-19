'use client';

import { useState } from 'react';
import { type SchemaField } from '@/lib/eas';
import { SchemaFieldInput } from './schema-field-input';
import { SchemaPreview } from './schema-preview';
import { HelpIcon } from './help-icon';
import { useTranslation } from '@/contexts/i18n-context';

interface SchemaBuilderProps {
  onSubmit: (fields: SchemaField[], revocable: boolean) => Promise<void>;
  isLoading?: boolean;
  initialFields?: SchemaField[];
}

interface FieldError {
  index: number;
  message: string;
}

export function SchemaBuilder({ onSubmit, isLoading = false, initialFields }: SchemaBuilderProps) {
  const { t } = useTranslation();
  const [fields, setFields] = useState<SchemaField[]>(initialFields || [
    { name: '', type: 'string', required: true },
  ]);
  const [revocable, setRevocable] = useState(true);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [formError, setFormError] = useState<string>('');

  const handleAddField = () => {
    setFields([...fields, { name: '', type: 'string', required: true }]);
    setErrors([]);
    setFormError('');
  };

  const handleRemoveField = (index: number) => {
    if (fields.length === 1) {
      setFormError(t('schema.create.fieldsMustHaveOne'));
      return;
    }
    setFields(fields.filter((_, i) => i !== index));
    setErrors(errors.filter((e) => e.index !== index));
    setFormError('');
  };

  const handleFieldChange = (index: number, field: SchemaField) => {
    const newFields = [...fields];
    newFields[index] = field;
    setFields(newFields);

    // Real-time validation for this field
    const newErrors = errors.filter((e) => e.index !== index);

    // Validate field name
    if (field.name.trim() && !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field.name)) {
      newErrors.push({
        index,
        message: t('schema.create.fieldNameInvalid'),
      });
    }

    // Check for duplicate field names
    const fieldNames = newFields
      .filter((_, i) => i !== index)
      .map((f) => f.name.toLowerCase());
    if (field.name.trim() && fieldNames.includes(field.name.toLowerCase())) {
      newErrors.push({
        index,
        message: t('schema.create.fieldNameDuplicate'),
      });
    }

    setErrors(newErrors);
    setFormError('');
  };

  const validateFields = (): boolean => {
    const newErrors: FieldError[] = [];
    const fieldNames = new Set<string>();

    fields.forEach((field, index) => {
      // Check if field name is empty
      if (!field.name.trim()) {
        newErrors.push({
          index,
          message: t('schema.create.fieldNameRequired'),
        });
        return;
      }

      // Check if field name is valid (alphanumeric and underscores only)
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field.name)) {
        newErrors.push({
          index,
          message: t('schema.create.fieldNameInvalid'),
        });
        return;
      }

      // Check for duplicate field names
      if (fieldNames.has(field.name.toLowerCase())) {
        newErrors.push({
          index,
          message: t('schema.create.fieldNameDuplicate'),
        });
        return;
      }

      fieldNames.add(field.name.toLowerCase());
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!validateFields()) {
      setFormError(t('schema.create.fixErrors'));
      return;
    }

    if (fields.length === 0) {
      setFormError(t('schema.create.fieldsMustHaveOne'));
      return;
    }

    try {
      await onSubmit(fields, revocable);
    } catch (error) {
      // Error handling is done by parent component
      console.error('Schema submission error:', error);
    }
  };

  const getFieldError = (index: number): string | undefined => {
    return errors.find((e) => e.index === index)?.message;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('schema.create.title')}</h2>
        <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t('schema.create.subtitle')}
        </p>
      </div>

      {/* Fields Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">{t('schema.create.fields')}</h3>
          <button
            type="button"
            onClick={handleAddField}
            disabled={isLoading}
            data-tutorial="add-field-button"
            className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 text-sm sm:text-base font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('schema.create.addField')}
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <SchemaFieldInput
              key={index}
              field={field}
              index={index}
              onChange={handleFieldChange}
              onRemove={handleRemoveField}
              error={getFieldError(index)}
            />
          ))}
        </div>
      </div>

      {/* Schema Preview */}
      <SchemaPreview fields={fields} />

      {/* Revocable Option */}
      <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <input
          type="checkbox"
          id="revocable"
          checked={revocable}
          onChange={(e) => setRevocable(e.target.checked)}
          disabled={isLoading}
          className="mt-1 w-5 h-5 sm:w-4 sm:h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 flex-shrink-0"
        />
        <div className="flex-1">
          <label
            htmlFor="revocable"
            className="block text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
          >
            {t('schema.create.allowRevocable')} <HelpIcon content={t('schema.create.revocableTooltip')} />
          </label>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('schema.create.revocableDescription')}
          </p>
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
          disabled={isLoading || fields.length === 0 || errors.length > 0}
          data-tutorial="submit-button"
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
              {t('schema.create.creating')}
            </span>
          ) : (
            t('schema.create.submit')
          )}
        </button>
      </div>
    </form>
  );
}
