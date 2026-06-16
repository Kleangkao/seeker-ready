import { Text, View } from 'react-native'

import { SEEKER_READY_TAGLINE } from '@/features/readiness/data-access/readiness-types'
import { useTheme } from '@/features/shell/data-access/use-theme'
import {
  SURFACE_CARD,
  SURFACE_PROGRESS_TRACK,
  TEXT_ON_GRADIENT_BODY,
  TEXT_ON_GRADIENT_TITLE,
  TEXT_ON_SURFACE_MUTED,
  TEXT_ON_SURFACE_TITLE,
} from '@/features/shell/ui/shell-ui-surface-styles'

export function ReadinessUiProgressHeader({
  completedCount,
  totalCount,
}: {
  completedCount: number
  totalCount: number
}) {
  const { tintColor } = useTheme()
  const progress = totalCount > 0 ? completedCount / totalCount : 0

  return (
    <View className="gap-3">
      <View className="gap-1">
        <Text className={`text-2xl font-semibold ${TEXT_ON_GRADIENT_TITLE}`}>Seeker Ready</Text>
        <Text className={`text-base leading-6 ${TEXT_ON_GRADIENT_BODY}`}>{SEEKER_READY_TAGLINE}</Text>
      </View>
      <View className={`gap-2 rounded-2xl p-4 ${SURFACE_CARD}`}>
        <View className="flex-row items-center justify-between">
          <Text className={`text-sm font-medium ${TEXT_ON_SURFACE_TITLE}`}>
            {completedCount}/{totalCount} ready
          </Text>
          <Text className={`text-sm ${TEXT_ON_SURFACE_MUTED}`}>{Math.round(progress * 100)}%</Text>
        </View>
        <View className={`h-2 overflow-hidden rounded-full ${SURFACE_PROGRESS_TRACK}`}>
          <View
            className="h-full rounded-full"
            style={{ backgroundColor: tintColor, width: `${Math.round(progress * 100)}%` }}
          />
        </View>
        <Text className={`text-xs leading-5 ${TEXT_ON_SURFACE_MUTED}`}>
          Track your readiness. This does not verify your wallet or account.
        </Text>
      </View>
    </View>
  )
}

