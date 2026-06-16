import Ionicons from '@expo/vector-icons/Ionicons'
import { Text, View } from 'react-native'

import { useTheme } from '@/features/shell/data-access/use-theme'
import { TEXT_ON_SURFACE_BODY, TEXT_ON_SURFACE_TITLE } from '@/features/shell/ui/shell-ui-surface-styles'

export function ReadinessUiPreviewBanner() {
  const { tintColor } = useTheme()

  return (
    <View className="gap-2 rounded-xl border border-blue-400/30 bg-blue-950/45 p-4">
      <View className="flex-row items-center gap-2">
        <Ionicons color={tintColor} name="information-circle-outline" size={20} />
        <Text className={`text-sm font-semibold ${TEXT_ON_SURFACE_TITLE}`}>Preview mode</Text>
      </View>
      <Text className={`text-sm leading-5 ${TEXT_ON_SURFACE_BODY}`}>
        Review the basics here. Wallet connection and signing work on Android with an MWA-compatible
        wallet.
      </Text>
    </View>
  )
}
