import Ionicons from '@expo/vector-icons/Ionicons'
import { Card } from 'heroui-native/card'
import { cn } from 'heroui-native/utils'
import { Text, View } from 'react-native'

import { ReadinessUiPressable } from '@/features/readiness/ui/readiness-ui-pressable'
import { useTheme } from '@/features/shell/data-access/use-theme'
import {
  SURFACE_BUTTON,
  SURFACE_CARD,
  SURFACE_CARD_COMPLETE,
  SURFACE_ICON,
  SURFACE_INNER,
  TEXT_ON_SURFACE_BODY,
  TEXT_ON_SURFACE_MUTED,
  TEXT_ON_SURFACE_TITLE,
} from '@/features/shell/ui/shell-ui-surface-styles'

function ConceptDetail({ label, text }: { label: string; text: string }) {
  return (
    <View className="gap-0.5">
      <Text className={`text-xs font-semibold uppercase tracking-wide ${TEXT_ON_SURFACE_MUTED}`}>
        {label}
      </Text>
      <Text className={`text-sm leading-5 ${TEXT_ON_SURFACE_BODY}`}>{text}</Text>
    </View>
  )
}

export function ReadinessUiConceptCard({
  complete,
  icon,
  onAcknowledge,
  remember,
  summary,
  title,
  whyItMatters,
}: {
  complete: boolean
  icon: keyof typeof Ionicons.glyphMap
  onAcknowledge(): void
  remember: string
  summary: string
  title: string
  whyItMatters: string
}) {
  const { tintColor } = useTheme()

  return (
    <Card className={cn('gap-3 border p-4', complete ? SURFACE_CARD_COMPLETE : SURFACE_CARD)}>
      <View className="flex-row items-start gap-3">
        <View className={`p-2.5 ${SURFACE_ICON}`}>
          <Ionicons color={complete ? '#22C55E' : tintColor} name={icon} size={22} />
        </View>
        <View className="flex-1 gap-1">
          <Card.Title className={`text-base font-semibold ${TEXT_ON_SURFACE_TITLE}`}>{title}</Card.Title>
          <Text className={`text-sm leading-5 ${TEXT_ON_SURFACE_MUTED}`}>{summary}</Text>
        </View>
        {complete ? (
          <View className="flex-row items-center gap-1 rounded-full bg-green-500/20 px-2 py-1">
            <Ionicons color="#22C55E" name="checkmark-circle" size={14} />
            <Text className="text-xs font-medium text-green-300">Got it</Text>
          </View>
        ) : null}
      </View>

      <View className={cn('gap-2.5 p-3', SURFACE_INNER)}>
        <ConceptDetail label="Why it matters" text={whyItMatters} />
        <ConceptDetail label="Remember" text={remember} />
      </View>

      {complete ? null : (
        <ReadinessUiPressable
          accessibilityRole="button"
          className={cn('items-center px-4 py-2.5', SURFACE_BUTTON)}
          onPress={onAcknowledge}
        >
          <Text className="text-sm font-semibold" style={{ color: tintColor }}>
            Got it
          </Text>
        </ReadinessUiPressable>
      )}
    </Card>
  )
}

