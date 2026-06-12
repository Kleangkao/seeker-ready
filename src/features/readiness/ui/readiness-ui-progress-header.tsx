import { Text, View } from 'react-native'

import { useTheme } from '@/features/shell/data-access/use-theme'

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
        <Text className="text-2xl font-semibold text-neutral-900 dark:text-white">Seeker Ready</Text>
        <Text className="text-base leading-6 text-muted">
          Post-unboxing readiness check for Solana Mobile users
        </Text>
      </View>
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-medium text-neutral-900 dark:text-white">
            {completedCount}/{totalCount} ready
          </Text>
          <Text className="text-sm text-muted">{Math.round(progress * 100)}%</Text>
        </View>
        <View className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <View
            className="h-full rounded-full"
            style={{ backgroundColor: tintColor, width: `${Math.round(progress * 100)}%` }}
          />
        </View>
      </View>
    </View>
  )
}
