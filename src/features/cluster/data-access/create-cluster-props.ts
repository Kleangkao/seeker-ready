import { createClusterStore, type ClusterStore } from '@/features/cluster/data-access/cluster-store'
import { createSyncCache } from '@/features/cluster/data-access/create-sync-cache'

export const APP_CLUSTER_STORAGE_KEY = 'wallet-ui:cluster'
export const APP_STORAGE_ID = 'seeker-ready'

export interface ClusterProviderConfig {
  store: ClusterStore
}

export function createClusterProps(): ClusterProviderConfig {
  const store = createClusterStore({
    cache: createSyncCache({
      storageId: APP_STORAGE_ID,
      storageKey: APP_CLUSTER_STORAGE_KEY,
    }),
  })
  return { store }
}
