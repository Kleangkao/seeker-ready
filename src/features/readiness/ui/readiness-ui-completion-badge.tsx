import Ionicons from '@expo/vector-icons/Ionicons'
import { Card } from 'heroui-native/card'
import { Text, View } from 'react-native'

import { useTheme } from '@/features/shell/data-access/use-theme'
import {
  SURFACE_CARD_COMPLETE,
  TEXT_ON_SURFACE_BODY,
  TEXT_ON_SURFACE_MUTED,
  TEXT_ON_SURFACE_TITLE,
} from '@/features/shell/ui/shell-ui-surface-styles'

export function ReadinessUiCompletionBadge() {
  const { tintColor } = useTheme()

  return (
    <Card className={`gap-3 border p-5 ${SURFACE_CARD_COMPLETE}`}>
      <View className="flex-row items-center gap-3">
        <Ionicons color="#22C55E" name="shield-checkmark" size={28} />
        <View className="flex-1 gap-1">
          <Card.Title className={`text-xl font-bold ${TEXT_ON_SURFACE_TITLE}`}>Seeker Ready</Card.Title>
          <Card.Description className={`leading-relaxed ${TEXT_ON_SURFACE_BODY}`}>
            You finished the readiness guide. Keep reading wallet prompts and using official links.
          </Card.Description>
        </View>
        <Ionicons color={tintColor} name="checkmark-circle" size={24} />
      </View>
      <Text className={`text-sm ${TEXT_ON_SURFACE_MUTED}`}>
        You can now explore dApps with more confidence. Keep reading wallet prompts and prefer official links.
      </Text>
    </Card>
  )
}
