/**
 * Cache utility for name resolution and schema data
 * Supports both in-memory and Redis/Upstash caching
 */

import type { Address } from 'viem';

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// In-memory cache as fallback
interface CacheEntry<T> {
  data: T;
  lastUpdated: number;
  ttl: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();

// Redis client (optional - will use in-memory if not configured)
let redisClient: any = null;

/**
 * Initialize Redis client if Upstash credentials are available
 */
async function getRedisClient() {
  if (redisClient !== null) {
    return redisClient;
  }

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    console.info('Redis not configured, using in-memory cache');
    redisClient = false; // Mark as unavailable
    return null;
  }

  try {
    // Dynamically import Upstash Redis
    // Dynamically import Upstash Redis
    const { Redis } = await import('@upstash/redis');
    redisClient = new Redis({
      url: redisUrl,
      token: redisToken,
    });
    console.info('Redis client initialized');
    return redisClient;
  } catch (error) {
    console.warn('Failed to initialize Redis, using in-memory cache:', error);
    redisClient = false;
    return null;
  }
}

/**
 * Get a value from cache
 */
export async function getCached<T>(key: string): Promise<T | null> {
  // Try Redis first
  const redis = await getRedisClient();
  if (redis) {
    try {
      const value = await redis.get(key) as T | null;
      if (value !== null) {
        return value;
      }
    } catch (error) {
      console.error('Redis get error:', error);
    }
  }

  // Fallback to memory cache
  const cached = memoryCache.get(key);
  if (cached && Date.now() - cached.lastUpdated < cached.ttl) {
    return cached.data;
  }

  return null;
}

/**
 * Set a value in cache
 */
export async function setCached<T>(
  key: string,
  value: T,
  ttlMs: number = CACHE_TTL
): Promise<void> {
  // Try Redis first
  const redis = await getRedisClient();
  if (redis) {
    try {
      await redis.set(key, value, { px: ttlMs });
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  // Always update memory cache as fallback
  memoryCache.set(key, {
    data: value,
    lastUpdated: Date.now(),
    ttl: ttlMs,
  });
}

/**
 * Delete a value from cache
 */
export async function deleteCached(key: string): Promise<void> {
  // Try Redis first
  const redis = await getRedisClient();
  if (redis) {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }

  // Delete from memory cache
  memoryCache.delete(key);
}

/**
 * Clear all cache entries matching a pattern
 */
export async function clearCachePattern(pattern: string): Promise<void> {
  // For Redis, use SCAN to find matching keys
  const redis = await getRedisClient();
  if (redis) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Redis pattern clear error:', error);
    }
  }

  // Clear matching keys from memory cache
  for (const key of memoryCache.keys()) {
    if (key.includes(pattern.replace('*', ''))) {
      memoryCache.delete(key);
    }
  }
}

/**
 * Clear expired entries from memory cache
 */
export function clearExpiredMemoryCache(): void {
  const now = Date.now();
  for (const [key, entry] of memoryCache.entries()) {
    if (now - entry.lastUpdated >= entry.ttl) {
      memoryCache.delete(key);
    }
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    memorySize: memoryCache.size,
    redisConfigured: redisClient !== false && redisClient !== null,
  };
}

// Name resolution cache helpers
export interface NameCacheData {
  ensName?: string;
  farcasterName?: string;
  avatar?: string;
}

export async function getCachedName(address: Address): Promise<NameCacheData | null> {
  const key = `name:${address.toLowerCase()}`;
  return getCached<NameCacheData>(key);
}

export async function setCachedName(
  address: Address,
  data: NameCacheData
): Promise<void> {
  const key = `name:${address.toLowerCase()}`;
  await setCached(key, data);
}

// Schema cache helpers
export interface SchemaCacheData {
  schema: string;
  resolver: string;
  revocable: boolean;
  creator: string;
  timestamp: number;
}

export async function getCachedSchema(schemaUID: string): Promise<SchemaCacheData | null> {
  const key = `schema:${schemaUID}`;
  return getCached<SchemaCacheData>(key);
}

export async function setCachedSchema(
  schemaUID: string,
  data: SchemaCacheData
): Promise<void> {
  const key = `schema:${schemaUID}`;
  await setCached(key, data);
}

export async function invalidateSchema(schemaUID: string): Promise<void> {
  const key = `schema:${schemaUID}`;
  await deleteCached(key);
}

// Periodic cleanup of memory cache (run every 10 minutes)
if (typeof window === 'undefined') {
  // Only run on server
  setInterval(clearExpiredMemoryCache, 10 * 60 * 1000);
}
