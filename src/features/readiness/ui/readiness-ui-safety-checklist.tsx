import Ionicons from '@expo/vector-icons/Ionicons'
import { cn } from 'heroui-native/utils'
import { Text, View } from 'react-native'

import type { SafetyHabitId } from '@/features/readiness/data-access/readiness-types'
import { ReadinessUiPressable } from '@/features/readiness/ui/readiness-ui-pressable'
import { useTheme } from '@/features/shell/data-access/use-theme'
import {
  SURFACE_CARD,
  SURFACE_CARD_COMPLETE,
  SURFACE_ICON,
  TEXT_ON_SURFACE_TITLE,
} from '@/features/shell/ui/shell-ui-surface-styles'

export function ReadinessUiSafetyChecklist({
  habits,
  onToggle,
  values,
}: {
  habits: { id: SafetyHabitId; icon: keyof typeof Ionicons.glyphMap; label: string }[]
  onToggle(id: SafetyHabitId): void
  values: Record<SafetyHabitId, boolean>
}) {
  const { tintColor } = useTheme()

  return (
    <View className="gap-2">
      {habits.map((habit) => {
        const checked = values[habit.id]

        return (
          <ReadinessUiPressable
            key={habit.id}
            accessibilityRole="checkbox"
            accessibilityState={{ checked }}
            className={cn(
              'flex-row items-center gap-3 rounded-xl border px-3 py-3',
              checked ? SURFACE_CARD_COMPLETE : SURFACE_CARD,
            )}
            onPress={() => onToggle(habit.id)}
          >
            <View className={cn('h-9 w-9 items-center justify-center rounded-lg', SURFACE_ICON)}>
              <Ionicons color={checked ? '#22C55E' : tintColor} name={habit.icon} size={18} />
            </View>
            <Text
              className={cn(
                'flex-1 text-sm leading-5',
                checked ? 'font-medium text-green-200' : TEXT_ON_SURFACE_TITLE,
              )}
            >
              {habit.label}
            </Text>
            <View
              className={cn(
                'h-6 w-6 items-center justify-center rounded-md border-2',
                checked ? 'border-green-500 bg-green-500' : 'border-white/25 bg-black/20',
              )}
            >
              {checked ? <Ionicons color="#FFFFFF" name="checkmark" size={14} /> : null}
            </View>
          </ReadinessUiPressable>
        )
      })}
    </View>
  )
}
