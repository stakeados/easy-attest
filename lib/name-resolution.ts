import { normalize } from 'viem/ens';
import { createPublicClient, http, type Address } from 'viem';
import { mainnet } from 'viem/chains';
import { getCachedName, setCachedName, type NameCacheData } from './cache';

// Create a public client for ENS resolution on mainnet
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

/**
 * Resolves an Ethereum address to its ENS name
 * @param address - The Ethereum address to resolve
 * @returns The ENS name if found, undefined otherwise
 */
export async function resolveENSName(
  address: Address
): Promise<string | undefined> {
  try {
    // Check cache first
    const cached = await getCachedName(address);
    if (cached?.ensName) {
      return cached.ensName;
    }

    // Resolve ENS name using viem
    // NOTE: Temporarily disabled to prevent CORS/Network errors in some environments
    // To enable: uncomment the code below and ensure publicClient is correctly configured
    /*
    const ensName = await publicClient.getEnsName({
      address,
    });
    await updateCache(address, { ensName: ensName || undefined });
    return ensName || undefined;
    */

    return undefined;
  } catch (error) {
    // Silently fail for DNS/Network errors to avoid console noise
    // console.warn('ENS resolution failed:', error);
    return undefined;
  }
}

/**
 * Resolves an ENS name to its Ethereum address
 * @param ensName - The ENS name to resolve
 * @returns The Ethereum address if found, undefined otherwise
 */
export async function resolveENSAddress(
  ensName: string
): Promise<Address | undefined> {
  try {
    const normalizedName = normalize(ensName);
    const address = await publicClient.getEnsAddress({
      name: normalizedName,
    });

    return address || undefined;
  } catch (error) {
    console.error('ENS address resolution failed:', error);
    return undefined;
  }
}

/**
 * Resolves an ENS avatar for an address
 * @param address - The Ethereum address
 * @returns The avatar URL if found, undefined otherwise
 */
export async function resolveENSAvatar(
  address: Address
): Promise<string | undefined> {
  try {
    const avatar = await publicClient.getEnsAvatar({
      name: normalize(address),
    });

    return avatar || undefined;
  } catch (error) {
    console.error('ENS avatar resolution failed:', error);
    return undefined;
  }
}

/**
 * Updates the name cache for a given address
 * @param address - The Ethereum address
 * @param data - Partial cache entry data to update
 */
async function updateCache(
  address: string,
  data: Partial<NameCacheData>
): Promise<void> {
  const existing = await getCachedName(address as Address);
  await setCachedName(address as Address, {
    ...existing,
    ...data,
  });
}

/**
 * Resolves a Farcaster username for an Ethereum address
 * @param address - The Ethereum address
 * @returns The Farcaster username if found, undefined otherwise
 */
export async function resolveFarcasterName(
  address: Address
): Promise<string | undefined> {
  try {
    // Check cache first
    const cached = await getCachedName(address);
    if (cached?.farcasterName) {
      return cached.farcasterName;
    }

    // Call Farcaster API
    const apiKey = process.env.FARCASTER_API_KEY;
    if (!apiKey) {
      // console.warn('Farcaster API key not configured');
      return undefined;
    }

    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${address}`,
      {
        headers: {
          accept: 'application/json',
          api_key: apiKey,
        },
      }
    );

    if (!response.ok) {
      console.error('Farcaster API request failed:', response.statusText);
      return undefined;
    }

    const data = await response.json();
    const user = data[address.toLowerCase()]?.[0];
    const farcasterName = user?.username;

    // Update cache
    await updateCache(address, { farcasterName });

    return farcasterName;
  } catch (error) {
    console.error('Farcaster resolution failed:', error);
    return undefined;
  }
}

/**
 * Resolves a name for an address using fallback chain: ENS → Farcaster → truncated address
 * @param address - The Ethereum address to resolve
 * @returns An object containing the resolved name and its source
 */
export async function resolveAddressName(address: Address): Promise<{
  name: string;
  source: 'ens' | 'farcaster' | 'address';
}> {
  // Try ENS first
  const ensName = await resolveENSName(address);
  if (ensName) {
    return { name: ensName, source: 'ens' };
  }

  // Try Farcaster
  const farcasterName = await resolveFarcasterName(address);
  if (farcasterName) {
    return { name: farcasterName, source: 'farcaster' };
  }

  // Fallback to truncated address
  return {
    name: truncateAddress(address),
    source: 'address',
  };
}

/**
 * Truncates an Ethereum address for display
 * @param address - The Ethereum address
 * @param prefixLength - Number of characters to show at start (default: 6)
 * @param suffixLength - Number of characters to show at end (default: 4)
 * @returns Truncated address string
 */
export function truncateAddress(
  address: string,
  prefixLength: number = 6,
  suffixLength: number = 4
): string {
  if (address.length <= prefixLength + suffixLength) {
    return address;
  }
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}
