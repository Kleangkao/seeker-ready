import Ionicons from '@expo/vector-icons/Ionicons'
import { Card } from 'heroui-native/card'
import { cn } from 'heroui-native/utils'
import type { ReactNode } from 'react'
import { Text, View } from 'react-native'

import { useTheme } from '@/features/shell/data-access/use-theme'
import {
  SURFACE_CARD,
  SURFACE_CARD_COMPLETE,
  TEXT_ON_SURFACE_MUTED,
  TEXT_ON_SURFACE_TITLE,
} from '@/features/shell/ui/shell-ui-surface-styles'

export function ReadinessUiStepCard({
  children,
  complete,
  completeLabel,
  description,
  icon,
  title,
}: {
  children?: ReactNode
  complete: boolean
  completeLabel?: string
  description: string
  icon: keyof typeof Ionicons.glyphMap
  title: string
}) {
  const { tintColor } = useTheme()

  return (
    <Card className={cn('gap-2 border p-4', complete ? SURFACE_CARD_COMPLETE : SURFACE_CARD)}>
      <View className="flex-row items-start gap-3">
        <Ionicons
          color={complete ? '#22C55E' : tintColor}
          name={complete ? 'checkmark-circle' : icon}
          size={24}
        />
        <View className="flex-1 gap-1">
          <Card.Title className={`text-lg font-semibold ${TEXT_ON_SURFACE_TITLE}`}>{title}</Card.Title>
          <Card.Description className={`leading-relaxed ${TEXT_ON_SURFACE_MUTED}`}>
            {description}
          </Card.Description>
        </View>
        {complete && completeLabel ? (
          <Text className="max-w-[7rem] text-right text-xs font-medium text-green-300">
            {completeLabel}
          </Text>
        ) : null}
      </View>
      {children ? <View className="gap-3 pt-1">{children}</View> : null}
    </Card>
  )
}
