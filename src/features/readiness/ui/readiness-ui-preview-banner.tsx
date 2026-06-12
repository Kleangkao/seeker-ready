import Ionicons from '@expo/vector-icons/Ionicons'
import { Text, View } from 'react-native'

import { useTheme } from '@/features/shell/data-access/use-theme'

export function ReadinessUiPreviewBanner() {
  const { tintColor } = useTheme()

  return (
    <View className="gap-2 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40">
      <View className="flex-row items-center gap-2">
        <Ionicons color={tintColor} name="information-circle-outline" size={20} />
        <Text className="text-sm font-semibold text-neutral-900 dark:text-white">Preview mode</Text>
      </View>
      <Text className="text-sm leading-5 text-neutral-700 dark:text-neutral-300">
        You can review the learning and safety steps here. Wallet connect and signing require Android
        with an MWA-compatible wallet.
      </Text>
    </View>
  )
}
