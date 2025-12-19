import { useEffect } from 'react';
import { useWalletClient } from 'wagmi';
import { walletClientToSigner, prefetchCommonSchemas } from '@/lib/eas';
import { querySchemas } from '@/lib/subgraph';

/**
 * Hook to prefetch common schemas on app load for better performance
 * Fetches the most popular schemas and caches them
 */
export function useSchemaPrefetch() {
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    async function prefetchSchemas() {
      if (!walletClient) return;

      try {
        // Fetch top 10 most popular schemas
        const schemas = await querySchemas({
          first: 10,
          orderBy: 'attestationCount',
          orderDirection: 'desc',
        });

        if (schemas.length === 0) return;

        // Convert wallet client to signer
        const signer = await walletClientToSigner(walletClient);

        // Prefetch schema details
        const schemaUIDs = schemas.map((s) => s.id);
        await prefetchCommonSchemas(signer, schemaUIDs);

        console.log(`Prefetched ${schemaUIDs.length} common schemas`);
      } catch (error) {
        console.warn('Failed to prefetch schemas:', error);
      }
    }

    prefetchSchemas();
  }, [walletClient]);
}
