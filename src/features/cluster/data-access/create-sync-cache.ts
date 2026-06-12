import { Platform } from 'react-native'
import { createMMKV } from 'react-native-mmkv'

import { createMemoryCache } from '@/features/cluster/data-access/memory-cache'
import { createMmkvCache } from '@/features/cluster/data-access/mmkv-cache'
import type { SyncCache } from '@/features/cluster/data-access/sync-cache'
import { createWebStorageCache } from '@/features/cluster/data-access/web-storage-cache'

const mmkvInstances = new Map<string, ReturnType<typeof createMMKV>>()

function getMmkvStorage(storageId: string) {
  let storage = mmkvInstances.get(storageId)
  if (!storage) {
    storage = createMMKV({ id: storageId })
    mmkvInstances.set(storageId, storage)
  }
  return storage
}

export function createSyncCache<T>({
  storageId,
  storageKey,
}: {
  storageId: string
  storageKey: string
}): SyncCache<T> {
  if (typeof window === 'undefined') {
    return createMemoryCache<T>(storageKey)
  }

  if (Platform.OS === 'web') {
    return createWebStorageCache<T>(storageKey)
  }

  return createMmkvCache<T>({
    storage: getMmkvStorage(storageId),
    storageKey,
  })
}
