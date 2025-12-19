'use client';

import { useEffect, useState } from 'react';
import { type Address } from 'viem';
import { resolveAddressName, truncateAddress } from '@/lib/name-resolution';

interface AddressDisplayProps {
  address: Address;
  showFullAddress?: boolean;
  className?: string;
  copyable?: boolean;
}

/**
 * AddressDisplay component that resolves and displays Ethereum addresses
 * with ENS or Farcaster names when available
 */
export function AddressDisplay({
  address,
  showFullAddress = false,
  className = '',
  copyable = false,
}: AddressDisplayProps) {
  const [displayName, setDisplayName] = useState<string>(
    truncateAddress(address)
  );
  const [source, setSource] = useState<'ens' | 'farcaster' | 'address'>(
    'address'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function resolveName() {
      try {
        const result = await resolveAddressName(address);
        if (isMounted) {
          setDisplayName(result.name);
          setSource(result.source);
        }
      } catch (error) {
        console.error('Failed to resolve address name:', error);
        if (isMounted) {
          setDisplayName(truncateAddress(address));
          setSource('address');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    resolveName();

    return () => {
      isMounted = false;
    };
  }, [address]);

  const handleCopy = async () => {
    if (!copyable) return;

    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const displayText = showFullAddress ? address : displayName;

  return (
    <span
      className={`inline-flex items-center gap-1 ${className}`}
      title={address}
    >
      {isLoading ? (
        <span className="animate-pulse text-gray-400">Loading...</span>
      ) : (
        <>
          <span
            className={`font-mono ${
              source === 'ens'
                ? 'text-blue-600'
                : source === 'farcaster'
                  ? 'text-purple-600'
                  : 'text-gray-700'
            }`}
          >
            {displayText}
          </span>
          {source === 'ens' && (
            <span className="text-xs text-blue-500" title="ENS Name">
              ⓔ
            </span>
          )}
          {source === 'farcaster' && (
            <span className="text-xs text-purple-500" title="Farcaster Name">
              ⓕ
            </span>
          )}
          {copyable && (
            <button
              onClick={handleCopy}
              className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Copy address"
            >
              {copied ? (
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
              ) : (
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
              )}
            </button>
          )}
        </>
      )}
    </span>
  );
}
