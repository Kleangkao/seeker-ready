import Ionicons from '@expo/vector-icons/Ionicons'
import { Card } from 'heroui-native/card'
import { Text, View } from 'react-native'

import { useTheme } from '@/features/shell/data-access/use-theme'

export function ReadinessUiCompletionBadge() {
  const { tintColor } = useTheme()

  return (
    <Card className="gap-3 border border-green-500/30 bg-green-50 p-5 dark:bg-green-950/20">
      <View className="flex-row items-center gap-3">
        <Ionicons color="#22C55E" name="shield-checkmark" size={28} />
        <View className="flex-1 gap-1">
          <Card.Title className="text-xl font-bold text-neutral-900 dark:text-white">Seeker Ready</Card.Title>
          <Card.Description className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            Your wallet interaction basics are ready.
          </Card.Description>
        </View>
        <Ionicons color={tintColor} name="checkmark-circle" size={24} />
      </View>
      <Text className="text-sm text-muted">
        You can now explore dApps with more confidence. Keep reading wallet prompts and prefer official links.
      </Text>
    </Card>
  )
}
