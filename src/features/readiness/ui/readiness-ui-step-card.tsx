import Ionicons from '@expo/vector-icons/Ionicons'
import { Card } from 'heroui-native/card'
import type { ReactNode } from 'react'
import { Text, View } from 'react-native'

import { useTheme } from '@/features/shell/data-access/use-theme'

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
    <Card className="gap-2 p-4">
      <View className="flex-row items-start gap-3">
        <Ionicons
          color={complete ? '#22C55E' : tintColor}
          name={complete ? 'checkmark-circle' : icon}
          size={24}
        />
        <View className="flex-1 gap-1">
          <Card.Title className="text-lg font-semibold">{title}</Card.Title>
          <Card.Description className="leading-relaxed">{description}</Card.Description>
        </View>
        {complete && completeLabel ? (
          <Text className="max-w-[7rem] text-right text-xs font-medium text-green-600 dark:text-green-400">
            {completeLabel}
          </Text>
        ) : null}
      </View>
      {children ? <View className="gap-3 pt-1">{children}</View> : null}
    </Card>
  )
}
