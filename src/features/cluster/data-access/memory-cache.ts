import type { SyncCache } from '@/features/cluster/data-access/sync-cache'

const memoryStores = new Map<string, unknown>()

export function createMemoryCache<T>(storageKey: string): SyncCache<T> {
  return {
    clear() {
      memoryStores.delete(storageKey)
    },
    get() {
      return memoryStores.get(storageKey) as T | undefined
    },
    set(value: T) {
      memoryStores.set(storageKey, value)
    },
  }
}
