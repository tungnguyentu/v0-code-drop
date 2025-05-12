type CacheOptions = {
  ttl: number // Time to live in seconds
}

type CachedData<T> = {
  data: T
  timestamp: number
}

// Simple in-memory cache
const cache = new Map<string, CachedData<any>>()

export function getCachedData<T>(key: string): T | null {
  const cachedItem = cache.get(key)

  if (!cachedItem) {
    return null
  }

  return cachedItem.data
}

export function setCachedData<T>(key: string, data: T, options: CacheOptions): void {
  cache.set(key, {
    data,
    timestamp: Date.now() + options.ttl * 1000,
  })
}

export function isCacheValid(key: string): boolean {
  const cachedItem = cache.get(key)

  if (!cachedItem) {
    return false
  }

  return Date.now() < cachedItem.timestamp
}

export function invalidateCache(key: string): void {
  cache.delete(key)
}

export function invalidateCacheByPrefix(prefix: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key)
    }
  }
}
