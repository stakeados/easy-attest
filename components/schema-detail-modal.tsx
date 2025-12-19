'use client';

import { useRouter } from 'next/navigation';
import { parseSchemaString } from '@/lib/eas';
import { AddressDisplay } from '@/components/address-display';
import type { SubgraphSchema } from '@/lib/subgraph';

interface SchemaDetailModalProps {
  schema: SubgraphSchema;
  onClose: () => void;
}

export function SchemaDetailModal({ schema, onClose }: SchemaDetailModalProps) {
  const router = useRouter();
  const fields = parseSchemaString(schema.schema);

  const handleUseSchema = () => {
    router.push(`/attest?schema=${schema.id}`);
  };

  const handleCopyUID = async () => {
    try {
      await navigator.clipboard.writeText(schema.id);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      string: 'bg-blue-100 text-blue-800',
      uint256: 'bg-green-100 text-green-800',
      bool: 'bg-purple-100 text-purple-800',
      address: 'bg-orange-100 text-orange-800',
      bytes32: 'bg-pink-100 text-pink-800',
      bytes: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Schema Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Schema UID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Schema UID
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-mono break-all text-gray-900 dark:text-gray-100">
                  {schema.id}
                </code>
                <button
                  onClick={handleCopyUID}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Copy UID"
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
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Fields ({fields.length})
              </label>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                          field.type
                        )}`}
                      >
                        {field.type}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{field.name}</p>
                    </div>
                    {field.required && (
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                          Required
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Schema String */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raw Schema String
              </label>
              <pre className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono overflow-x-auto">
                {schema.schema}
              </pre>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Creator */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Created By
                </label>
                <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <AddressDisplay address={schema.creator as `0x${string}`} />
                </div>
              </div>

              {/* Timestamp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Created On
                </label>
                <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                  {formatTimestamp(schema.timestamp)}
                </div>
              </div>
            </div>

            {/* Usage Stats */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usage Statistics
              </label>
              <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm text-blue-900">
                    <span className="font-bold">{schema.attestationCount}</span> attestation
                    {schema.attestationCount !== 1 ? 's' : ''} created using this schema
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleUseSchema}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Use This Schema
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
