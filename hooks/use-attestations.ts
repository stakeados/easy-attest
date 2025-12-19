'use client';

import { useState, useEffect, useCallback } from 'react';
import { type Address } from 'viem';
import {
  queryAttestationsReceived,
  queryAttestationsGiven,
  type SubgraphAttestation,
} from '@/lib/subgraph';
import { EAS_CONTRACT_ADDRESS } from '@/lib/eas';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

export interface AttestationDisplay {
  uid: string;
  schemaUID: string;
  schemaString: string;
  attester: Address;
  recipient: Address;
  data: string;
  timestamp: number;
  txHash: string;
  revoked?: boolean;
}

interface UseAttestationsOptions {
  address?: Address;
  type: 'received' | 'given';
  schemaUID?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date-desc' | 'date-asc';
}

export function useAttestations(options: UseAttestationsOptions) {
  const { address, type, schemaUID, startDate, endDate, sortBy = 'date-desc' } = options;

  const [attestations, setAttestations] = useState<AttestationDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchAttestations = useCallback(async () => {
    if (!address) {
      setAttestations([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Try fetching from subgraph first
      const subgraphAttestations = await fetchFromSubgraph();
      const displayAttestations = subgraphAttestations.map(transformSubgraphAttestation);
      setAttestations(displayAttestations);
    } catch (subgraphError) {
      // In production, you might want to log this to a service like Sentry
      // console.error('Subgraph fetch failed:', subgraphError);

      try {
        // Fallback to direct RPC calls
        const rpcAttestations = await fetchFromRPC();
        if (rpcAttestations.length === 0) {
          setError('Unable to load attestations from Subgraph. Please check configuration.');
        }
        setAttestations(rpcAttestations);
      } catch (rpcError) {
        setError('Failed to load attestations. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [address, type, schemaUID, startDate, endDate, sortBy]);

  const fetchFromSubgraph = async (): Promise<SubgraphAttestation[]> => {
    if (!address) return [];

    const queryOptions = {
      schemaUID,
      startDate,
      endDate,
      sortBy,
    };

    if (type === 'received') {
      return await queryAttestationsReceived(address, queryOptions);
    } else {
      return await queryAttestationsGiven(address, queryOptions);
    }
  };

  const fetchFromRPC = async (): Promise<AttestationDisplay[]> => {
    if (!address) return [];

    // Create a public client for RPC calls
    const client = createPublicClient({
      chain: base,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL),
    });

    // Note: This is a simplified fallback. In production, you would need to:
    // 1. Query events from the EAS contract
    // 2. Filter by address (recipient or attester)
    // 3. Fetch attestation details for each UID
    // 4. Apply filters and sorting

    // For now, return empty array as full RPC implementation would be complex
    // For now, return empty array as full RPC implementation would be complex
    return [];
  };

  const transformSubgraphAttestation = (
    attestation: SubgraphAttestation
  ): AttestationDisplay => {
    return {
      uid: attestation.id,
      schemaUID: attestation.schema?.id || '0x0000000000000000000000000000000000000000000000000000000000000000',
      schemaString: attestation.schema?.schema || 'uint256 time, string data',
      attester: attestation.attester as Address,
      recipient: attestation.recipient as Address,
      data: attestation.data,
      timestamp: parseInt(attestation.time),
      txHash: attestation.txHash,
      revoked: attestation.revoked,
    };
  };

  const retry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    fetchAttestations();
  }, [fetchAttestations, retryCount]);

  return {
    attestations,
    isLoading,
    error,
    retry,
  };
}
