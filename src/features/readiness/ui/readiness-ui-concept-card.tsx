import { cn } from 'heroui-native/utils'
import { Text, View } from 'react-native'

import { ReadinessUiPressable } from '@/features/readiness/ui/readiness-ui-pressable'
import { useTheme } from '@/features/shell/data-access/use-theme'

export function ReadinessUiConceptCard({
  body,
  complete,
  onAcknowledge,
}: {
  body: string
  complete: boolean
  onAcknowledge(): void
}) {
  const { tintColor } = useTheme()

  return (
    <View className="gap-3">
      <Text className="text-sm leading-5 text-neutral-800 dark:text-neutral-200">{body}</Text>
      {complete ? (
        <Text className="text-sm font-medium text-green-600 dark:text-green-400">Read</Text>
      ) : (
        <ReadinessUiPressable
          accessibilityRole="button"
          className={cn(
            'items-center rounded-xl border px-4 py-2.5 active:opacity-80',
            'border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900',
          )}
          onPress={onAcknowledge}
        >
          <Text className="text-sm font-semibold" style={{ color: tintColor }}>
            Mark as read
          </Text>
        </ReadinessUiPressable>
      )}
    </View>
  )
}
