import Constants from 'expo-constants'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Link } from 'expo-router'
import { Card } from 'heroui-native/card'
import { useToast } from 'heroui-native/toast'
import { Pressable, Text, View } from 'react-native'

import { resetReadinessProgress } from '@/features/readiness/data-access/readiness-store'
import { ReadinessUiPressable } from '@/features/readiness/ui/readiness-ui-pressable'
import { useTheme } from '@/features/shell/data-access/use-theme'
import { ShellUiPage } from '@/features/shell/ui/shell-ui-page'
import { ShellUiPageHeader } from '@/features/shell/ui/shell-ui-page-header'
import { ShellUiThemeSwitcher } from '@/features/shell/ui/shell-ui-theme-switcher'
import packageJson from '../../../package.json'

const RESET_READINESS_TOAST_ID = 'reset-readiness-progress'

export function SettingsFeatureEntry() {
  const { tintColor } = useTheme()
  const { toast } = useToast()
  const appName = Constants.expoConfig?.name ?? 'Seeker Ready'
  const appVersion = packageJson.version

  return (
    <ShellUiPage contentClassName="flex-1 justify-between gap-0">
      <View className="gap-6">
        <ShellUiPageHeader
          description="Post-unboxing readiness check for Solana Mobile users"
          title="Settings"
        />
        <Link asChild href="/settings/cluster">
          <Pressable accessibilityRole="button">
            <Card className="gap-2 p-5">
              <View className="flex-row items-center gap-2">
                <Ionicons color={tintColor} name="server-outline" size={22} />
                <Card.Title className="flex-1 text-xl font-bold">Cluster</Card.Title>
                <Ionicons color={tintColor} name="chevron-forward" size={18} />
              </View>
              <Card.Description className="leading-relaxed">
                RPC and wallet authorization target for development or workshops.
              </Card.Description>
            </Card>
          </Pressable>
        </Link>
        <ShellUiThemeSwitcher />
        <Card className="gap-2 p-5">
          <Card.Title className="text-xl font-bold">Testing without Seeker</Card.Title>
          <Card.Description className="leading-relaxed">
            Web preview can verify layout, learning steps, resources, safety habits, reset, and
            persistence. Wallet connect and signing require Android with an MWA-compatible wallet.
          </Card.Description>
        </Card>
        <Card className="gap-3 p-5">
          <View className="gap-1">
            <Card.Title className="text-xl font-bold">Reset readiness</Card.Title>
            <Card.Description className="leading-relaxed">
              Clear saved checklist progress on this device. Wallet connection is not stored.
            </Card.Description>
          </View>
          <ReadinessUiPressable
            className="items-center rounded-xl border border-neutral-300 px-4 py-3 active:opacity-80 dark:border-neutral-700"
            onPress={() => {
              resetReadinessProgress()
              toast.show({
                description: 'Your readiness checklist progress was cleared on this device.',
                id: RESET_READINESS_TOAST_ID,
                label: 'Checklist reset',
                placement: 'bottom',
                variant: 'success',
              })
            }}
          >
            <Text className="text-sm font-semibold text-neutral-900 dark:text-white">
              Reset checklist progress
            </Text>
          </ReadinessUiPressable>
        </Card>
      </View>
      <Text className="w-full py-3 text-center text-muted">{`${appName} v${appVersion}`}</Text>
    </ShellUiPage>
  )
}
