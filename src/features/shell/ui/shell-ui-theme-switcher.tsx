import Ionicons from '@expo/vector-icons/Ionicons'
import { cn } from 'heroui-native/utils'
import type { ComponentProps } from 'react'
import { Pressable, Text, View } from 'react-native'

import type { Theme } from '@/features/shell/data-access/use-theme'
import { setTheme, useTheme } from '@/features/shell/data-access/use-theme'
import {
  SURFACE_CARD,
  SURFACE_ICON,
  TEXT_ON_SURFACE_MUTED,
} from '@/features/shell/ui/shell-ui-surface-styles'

type ThemeIcon = ComponentProps<typeof import('@expo/vector-icons/Ionicons').default>['name']

const themeIcons: Record<Theme, ThemeIcon> = {
  dark: 'moon-outline',
  light: 'sunny-outline',
  system: 'phone-portrait-outline',
}

export function ShellUiThemeSwitcher() {
  const { activeTheme, themes } = useTheme()

  return (
    <View className={cn('flex-row p-1', SURFACE_CARD)}>
      {themes.map((theme) => {
        const isSelected = activeTheme === theme.name

        return (
          <ThemeSwitcherItem
            icon={themeIcons[theme.name]}
            isSelected={isSelected}
            key={theme.name}
            label={theme.label}
            onPress={() => setTheme(theme.name)}
          />
        )
      })}
    </View>
  )
}

function ThemeSwitcherItem({
  icon,
  isSelected,
  label,
  onPress,
}: {
  icon: ThemeIcon
  isSelected: boolean
  label: string
  onPress(): void
}) {
  const color = isSelected ? '#208AEF' : 'rgba(255,255,255,0.55)'

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      className={cn(
        'min-h-16 flex-1 items-center justify-center gap-1 rounded-xl px-2 py-2',
        isSelected ? SURFACE_ICON : 'bg-transparent',
      )}
      onPress={onPress}
    >
      <Ionicons color={color} name={icon} size={22} />
      <Text
        className={cn(
          'text-sm font-semibold',
          isSelected ? 'text-blue-300' : TEXT_ON_SURFACE_MUTED,
        )}
      >
        {label}
      </Text>
    </Pressable>
  )
}
