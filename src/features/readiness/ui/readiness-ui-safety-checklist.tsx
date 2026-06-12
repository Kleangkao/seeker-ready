import Ionicons from '@expo/vector-icons/Ionicons'
import { cn } from 'heroui-native/utils'
import { Text, View } from 'react-native'

import type { SafetyHabitId } from '@/features/readiness/data-access/readiness-types'
import { ReadinessUiPressable } from '@/features/readiness/ui/readiness-ui-pressable'

export function ReadinessUiSafetyChecklist({
  habits,
  onToggle,
  values,
}: {
  habits: { id: SafetyHabitId; label: string }[]
  onToggle(id: SafetyHabitId): void
  values: Record<SafetyHabitId, boolean>
}) {
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
              checked
                ? 'border-green-500/40 bg-green-50 dark:bg-green-950/20'
                : 'border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900',
            )}
            onPress={() => onToggle(habit.id)}
          >
            <View
              className={cn(
                'h-6 w-6 items-center justify-center rounded-md border-2',
                checked ? 'border-green-500 bg-green-500' : 'border-neutral-400 bg-white dark:bg-neutral-950',
              )}
            >
              {checked ? <Ionicons color="#FFFFFF" name="checkmark" size={16} /> : null}
            </View>
            <Text
              className={cn(
                'flex-1 text-sm leading-5',
                checked
                  ? 'font-medium text-green-800 dark:text-green-200'
                  : 'text-neutral-900 dark:text-white',
              )}
            >
              {habit.label}
            </Text>
          </ReadinessUiPressable>
        )
      })}
    </View>
  )
}
