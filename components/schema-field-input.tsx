'use client';

import { type SchemaField } from '@/lib/eas';

interface SchemaFieldInputProps {
  field: SchemaField;
  index: number;
  onChange: (index: number, field: SchemaField) => void;
  onRemove: (index: number) => void;
  error?: string;
}

const FIELD_TYPES = [
  { value: 'string', label: 'String' },
  { value: 'uint256', label: 'Number (uint256)' },
  { value: 'bool', label: 'Boolean' },
  { value: 'address', label: 'Address' },
  { value: 'bytes32', label: 'Bytes32' },
  { value: 'bytes', label: 'Bytes' },
] as const;

export function SchemaFieldInput({
  field,
  index,
  onChange,
  onRemove,
  error,
}: SchemaFieldInputProps) {
  return (
    <div className="flex flex-col gap-3 p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
      {/* Mobile Layout: Stacked */}
      <div className="flex flex-col sm:hidden gap-3">
        {/* Field Name Input */}
        <div>
          <label
            htmlFor={`field-name-${index}`}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Field Name
          </label>
          <input
            id={`field-name-${index}`}
            type="text"
            value={field.name}
            onChange={(e) =>
              onChange(index, { ...field, name: e.target.value })
            }
            placeholder="e.g., score, verified"
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base min-h-[44px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* Field Type Dropdown */}
        <div>
          <label
            htmlFor={`field-type-${index}`}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Type
          </label>
          <select
            id={`field-type-${index}`}
            value={field.type}
            onChange={(e) =>
              onChange(index, {
                ...field,
                type: e.target.value as SchemaField['type'],
              })
            }
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base min-h-[44px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {FIELD_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Required Toggle & Remove Button */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) =>
                onChange(index, { ...field, required: e.target.checked })
              }
              className="w-5 h-5 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 bg-white dark:bg-gray-700"
            />
            <span className="text-base font-medium text-gray-700 dark:text-gray-300">Required</span>
          </label>

          <button
            type="button"
            onClick={() => onRemove(index)}
            className="min-h-[44px] min-w-[44px] px-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors flex items-center justify-center"
            aria-label="Remove field"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop Layout: Horizontal */}
      <div className="hidden sm:flex items-start gap-3">
        {/* Field Name Input */}
        <div className="flex-1">
          <label
            htmlFor={`field-name-${index}`}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Field Name
          </label>
          <input
            id={`field-name-${index}`}
            type="text"
            value={field.name}
            onChange={(e) =>
              onChange(index, { ...field, name: e.target.value })
            }
            placeholder="e.g., score, verified, username"
            data-tutorial="field-name-input"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* Field Type Dropdown */}
        <div className="flex-1">
          <label
            htmlFor={`field-type-${index}`}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Type
          </label>
          <select
            id={`field-type-${index}`}
            value={field.type}
            onChange={(e) =>
              onChange(index, {
                ...field,
                type: e.target.value as SchemaField['type'],
              })
            }
            data-tutorial="field-type-select"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {FIELD_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Required Toggle */}
        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) =>
                onChange(index, { ...field, required: e.target.checked })
              }
              data-tutorial="field-required-toggle"
              className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 bg-white dark:bg-gray-700"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Required</span>
          </label>
        </div>

        {/* Remove Button */}
        <div className="flex flex-col justify-end">
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="min-h-[44px] min-w-[44px] px-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            aria-label="Remove field"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}
