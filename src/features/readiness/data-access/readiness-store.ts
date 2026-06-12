import { atom } from 'nanostores'

import { APP_STORAGE_ID } from '@/features/cluster/data-access/create-cluster-props'
import { createSyncCache } from '@/features/cluster/data-access/create-sync-cache'
import type { SyncCache } from '@/features/cluster/data-access/sync-cache'
import {
  DEFAULT_READINESS_PROGRESS,
  type ReadinessProgress,
  type SafetyHabitId,
} from '@/features/readiness/data-access/readiness-types'

export const READINESS_STORAGE_KEY = 'seeker-ready:progress'

let readinessCache: SyncCache<ReadinessProgress> | null = null
let hydrated = false

function getReadinessCache() {
  if (!readinessCache) {
    readinessCache = createSyncCache<ReadinessProgress>({
      storageId: APP_STORAGE_ID,
      storageKey: READINESS_STORAGE_KEY,
    })
  }
  return readinessCache
}

function normalizeProgress(value: unknown): ReadinessProgress {
  if (!value || typeof value !== 'object') {
    return DEFAULT_READINESS_PROGRESS
  }

  const stored = value as Partial<ReadinessProgress>

  return {
    ...DEFAULT_READINESS_PROGRESS,
    ...stored,
    safetyHabits: {
      ...DEFAULT_READINESS_PROGRESS.safetyHabits,
      ...stored.safetyHabits,
    },
  }
}

const $progress = atom<ReadinessProgress>(DEFAULT_READINESS_PROGRESS)

function ensureHydrated() {
  if (hydrated || typeof window === 'undefined') {
    return
  }

  hydrated = true
  $progress.set(normalizeProgress(getReadinessCache().get()))
}

function persist(progress: ReadinessProgress) {
  ensureHydrated()
  if (typeof window !== 'undefined') {
    getReadinessCache().set(progress)
  }
  $progress.set(progress)
}

export function getReadinessProgressStore() {
  ensureHydrated()
  return $progress
}

export function markStepComplete(step: keyof Omit<ReadinessProgress, 'safetyHabits'>) {
  const current = $progress.get()
  persist({ ...current, [step]: true })
}

export function toggleSafetyHabit(id: SafetyHabitId) {
  const current = $progress.get()
  persist({
    ...current,
    safetyHabits: {
      ...current.safetyHabits,
      [id]: !current.safetyHabits[id],
    },
  })
}

export function resetReadinessProgress() {
  persist(DEFAULT_READINESS_PROGRESS)
}

export function isSafetyHabitsComplete(progress: ReadinessProgress) {
  return Object.values(progress.safetyHabits).every(Boolean)
}
