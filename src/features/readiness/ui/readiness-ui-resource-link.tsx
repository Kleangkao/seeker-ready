import Ionicons from '@expo/vector-icons/Ionicons'
import * as Linking from 'expo-linking'
import { cn } from 'heroui-native/utils'
import { Card } from 'heroui-native/card'
import { Platform, Text, View } from 'react-native'

import { ReadinessUiPressable } from '@/features/readiness/ui/readiness-ui-pressable'
import { useTheme } from '@/features/shell/data-access/use-theme'

function ResourceLinkContent({ title, url }: { title: string; url: string }) {
  const { tintColor } = useTheme()

  return (
    <Card
      className={cn(
        'border p-4',
        'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <View className="flex-row items-center gap-3">
        <View className="rounded-full bg-blue-100 p-2 dark:bg-blue-950">
          <Ionicons color={tintColor} name="open-outline" size={18} />
        </View>
        <View className="flex-1 gap-0.5">
          <Text className="text-base font-semibold text-neutral-900 dark:text-white">{title}</Text>
          <Text className="text-sm text-muted">{url}</Text>
        </View>
        <View className="flex-row items-center gap-1 rounded-full bg-neutral-100 px-2 py-1 dark:bg-neutral-900">
          <Text className="text-xs font-medium text-blue-600 dark:text-blue-400">Open</Text>
          <Ionicons color={tintColor} name="chevron-forward" size={14} />
        </View>
      </View>
    </Card>
  )
}

export function ReadinessUiResourceLink({
  onOpen,
  title,
  url,
}: {
  onOpen(): void
  title: string
  url: string
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
        <ResourceLinkContent title={title} url={url} />
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
      <ResourceLinkContent title={title} url={url} />
    </ReadinessUiPressable>
  )
}
