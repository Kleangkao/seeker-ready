import Ionicons from '@expo/vector-icons/Ionicons'
import * as Linking from 'expo-linking'
import { cn } from 'heroui-native/utils'
import { Card } from 'heroui-native/card'
import { Platform, Text, View } from 'react-native'

import { ReadinessUiPressable } from '@/features/readiness/ui/readiness-ui-pressable'
import { useTheme } from '@/features/shell/data-access/use-theme'
import {
  SURFACE_BUTTON,
  SURFACE_CARD,
  SURFACE_ICON,
  TEXT_ON_SURFACE_BODY,
  TEXT_ON_SURFACE_MUTED,
  TEXT_ON_SURFACE_TITLE,
} from '@/features/shell/ui/shell-ui-surface-styles'

function ResourceLinkContent({
  buttonLabel,
  description,
  title,
  useFor,
}: {
  buttonLabel: string
  description: string
  title: string
  useFor: string
}) {
  const { tintColor } = useTheme()

  return (
    <Card className={cn('gap-3 border p-4', SURFACE_CARD)}>
      <View className="flex-row items-start gap-3">
        <View className={`p-2.5 ${SURFACE_ICON}`}>
          <Ionicons color={tintColor} name="globe-outline" size={20} />
        </View>
        <View className="flex-1 gap-1.5">
          <Text className={`text-base font-semibold ${TEXT_ON_SURFACE_TITLE}`}>{title}</Text>
          <Text className={`text-sm leading-5 ${TEXT_ON_SURFACE_MUTED}`}>{description}</Text>
          <View className="gap-0.5">
            <Text className={`text-xs font-semibold uppercase tracking-wide ${TEXT_ON_SURFACE_MUTED}`}>
              Use this for
            </Text>
            <Text className={`text-sm leading-5 ${TEXT_ON_SURFACE_BODY}`}>{useFor}</Text>
          </View>
        </View>
      </View>

      <View className={cn('flex-row items-center justify-center gap-1 px-3 py-2.5', SURFACE_BUTTON)}>
        <Text className="text-sm font-semibold" style={{ color: tintColor }}>
          {buttonLabel}
        </Text>
        <Ionicons color={tintColor} name="open-outline" size={16} />
      </View>
    </Card>
  )
}

export function ReadinessUiResourceLink({
  buttonLabel,
  description,
  onOpen,
  title,
  url,
  useFor,
}: {
  buttonLabel: string
  description: string
  onOpen(): void
  title: string
  url: string
  useFor: string
}) {
  if (Platform.OS === 'web') {
    return (
      <a
        href={url}
        rel="noopener noreferrer"
        style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
        target="_blank"
        onClick={() => onOpen()}
      >
        <ResourceLinkContent
          buttonLabel={buttonLabel}
          description={description}
          title={title}
          useFor={useFor}
        />
      </a>
    )
  }

  return (
    <ReadinessUiPressable
      accessibilityHint="Opens in your browser"
      accessibilityRole="link"
      onPress={() => {
        onOpen()
        void Linking.openURL(url)
      }}
    >
      <ResourceLinkContent
        buttonLabel={buttonLabel}
        description={description}
        title={title}
        useFor={useFor}
      />
    </ReadinessUiPressable>
  )
}
