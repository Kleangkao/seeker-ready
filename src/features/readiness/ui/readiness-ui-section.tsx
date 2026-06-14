import Ionicons from '@expo/vector-icons/Ionicons'
import type { ReactNode } from 'react'
import { Text, View } from 'react-native'

import { useTheme } from '@/features/shell/data-access/use-theme'
import {
  SURFACE_ICON,
  SURFACE_SECTION,
  TEXT_ON_SURFACE_MUTED,
  TEXT_ON_SURFACE_TITLE,
} from '@/features/shell/ui/shell-ui-surface-styles'

export function ReadinessUiSection({
  children,
  description,
  icon,
  title,
}: {
  children: ReactNode
  description: string
  icon: keyof typeof Ionicons.glyphMap
  title: string
}) {
  const { tintColor } = useTheme()

  return (
    <View className="gap-3">
      <View className={`gap-2 rounded-2xl px-4 py-3 ${SURFACE_SECTION}`}>
        <View className="flex-row items-center gap-2.5">
          <View className={`p-2 ${SURFACE_ICON}`}>
            <Ionicons color={tintColor} name={icon} size={20} />
          </View>
          <Text className={`flex-1 text-lg font-semibold ${TEXT_ON_SURFACE_TITLE}`}>{title}</Text>
        </View>
        <Text className={`text-sm leading-5 ${TEXT_ON_SURFACE_MUTED}`}>{description}</Text>
      </View>
      <View className="gap-3">{children}</View>
    </View>
  )
}
