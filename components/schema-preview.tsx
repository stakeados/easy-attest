'use client';

import { type SchemaField, generateSchemaString } from '@/lib/eas';

interface SchemaPreviewProps {
  fields: SchemaField[];
}

export function SchemaPreview({ fields }: SchemaPreviewProps) {
  const schemaString = fields.length > 0 ? generateSchemaString(fields) : '';

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg" data-tutorial="schema-preview">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Schema Preview
      </h3>
      {fields.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          Add fields to see the schema preview
        </p>
      ) : (
        <div className="space-y-3">
          {/* Schema String */}
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Generated Schema:</p>
            <code className="block p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
              {schemaString}
            </code>
          </div>

          {/* Field List */}
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Fields:</p>
            <div className="space-y-1">
              {fields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-100 dark:border-gray-700"
                >
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {field.name}
                  </span>
                  <span className="text-gray-400">:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono text-xs">
                    {field.type}
                  </span>
                  {field.required && (
                    <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 font-medium">
                      Required
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
