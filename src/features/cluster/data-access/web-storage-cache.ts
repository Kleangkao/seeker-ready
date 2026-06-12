import { parseCacheValue, stringifyCacheValue } from '@/features/cluster/data-access/cache-json'
import type { SyncCache } from '@/features/cluster/data-access/sync-cache'

export function createWebStorageCache<T>(storageKey: string): SyncCache<T> {
  return {
    clear() {
      globalThis.localStorage?.removeItem(storageKey)
    },
    get() {
      const cached = globalThis.localStorage?.getItem(storageKey)
      return cached ? parseCacheValue<T>(storageKey, cached) : undefined
    },
    set(value: T) {
      globalThis.localStorage?.setItem(storageKey, stringifyCacheValue(value))
    },
  }
}
