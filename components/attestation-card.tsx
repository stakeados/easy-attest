'use client';

import { useMemo } from 'react';
import { AddressDisplay } from './address-display';
import { type Address } from 'viem';
import { parseSchemaString } from '@/lib/eas';

interface AttestationCardProps {
  uid: string;
  schemaUID: string;
  schemaString: string;
  attester: Address;
  recipient: Address;
  data: string; // Hex encoded data
  timestamp: number;
  txHash: string;
  revoked?: boolean;
}

export function AttestationCard({
  uid,
  schemaUID,
  schemaString,
  attester,
  recipient,
  data,
  timestamp,
  txHash,
  revoked = false,
}: AttestationCardProps) {
  const date = new Date(timestamp * 1000);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Parse schema to get field names (memoized to prevent re-parsing on render)
  const schemaName = useMemo(() => {
    const isUnknownSchema = schemaUID === '0x0000000000000000000000000000000000000000000000000000000000000000';

    if (isUnknownSchema) {
      return 'Easy Attest Record';
    }

    const schemaFields = parseSchemaString(schemaString);
    if (schemaFields.length > 0) {
      return schemaFields.map(f => f.name).join(', ');
    }

    return 'Attestation';
  }, [schemaUID, schemaString]);

  // Note: isUnknownSchema is derived inside the memo, but we need it for the render logic below
  const isUnknownSchema = schemaUID === '0x0000000000000000000000000000000000000000000000000000000000000000';

  // Get block explorer URL
  const explorerUrl = `https://basescan.org/tx/${txHash}`;

  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 bg-white dark:bg-gray-800 ${revoked ? 'opacity-60' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {schemaName}
          </h3>
          {!isUnknownSchema && (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-all">
              Schema: {schemaUID.slice(0, 10)}...{schemaUID.slice(-8)}
            </p>
          )}
        </div>
        {revoked && (
          <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-xs font-medium rounded-full self-start">
            Revoked
          </span>
        )}
      </div>

      {/* Data Preview */}
      <div className="mb-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-mono break-all">
          {data.slice(0, 100)}...
        </p>
      </div>

      {/* Participants */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Attester</p>
          <AddressDisplay address={attester} copyable />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Recipient</p>
          <AddressDisplay address={recipient} copyable />
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{formattedDate}</span>
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center gap-1 min-h-[44px] sm:min-h-0"
        >
          View on Explorer
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
    </div>
  );
}
