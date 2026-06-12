import { useStore } from '@nanostores/react'

import {
  getReadinessProgressStore,
  isSafetyHabitsComplete,
  markStepComplete,
  resetReadinessProgress,
  toggleSafetyHabit,
} from '@/features/readiness/data-access/readiness-store'
import {
  LEARNING_READINESS_STEPS,
  READINESS_STEPS,
  WALLET_READINESS_STEPS,
  type ReadinessStepId,
} from '@/features/readiness/data-access/readiness-types'

export function useReadiness() {
  const progress = useStore(getReadinessProgressStore())

  function isStepComplete(stepId: ReadinessStepId) {
    switch (stepId) {
      case 'connectWallet':
        return progress.connectWallet
      case 'safeSignature':
        return progress.safeSignature
      case 'understandMwa':
        return progress.understandMwa
      case 'understandSeedVault':
        return progress.understandSeedVault
      case 'understandDappStore':
        return progress.understandDappStore
      case 'understandSeekerId':
        return progress.understandSeekerId
      case 'trustedResources':
        return progress.trustedResources
      case 'safetyHabits':
        return isSafetyHabitsComplete(progress)
    }
  }

  const completedCount = READINESS_STEPS.filter((stepId) => isStepComplete(stepId)).length
  const learningCompletedCount = LEARNING_READINESS_STEPS.filter((stepId) => isStepComplete(stepId)).length
  const walletCompletedCount = WALLET_READINESS_STEPS.filter((stepId) => isStepComplete(stepId)).length
  const isAllComplete = completedCount === READINESS_STEPS.length

  return {
    completedCount,
    isAllComplete,
    isStepComplete,
    learningCompletedCount,
    learningTotalCount: LEARNING_READINESS_STEPS.length,
    markStepComplete,
    progress,
    resetReadinessProgress,
    toggleSafetyHabit,
    totalCount: READINESS_STEPS.length,
    walletCompletedCount,
    walletTotalCount: WALLET_READINESS_STEPS.length,
  }
}
