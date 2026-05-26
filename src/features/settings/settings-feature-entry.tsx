import Ionicons from '@expo/vector-icons/Ionicons'
import { Card } from 'heroui-native/card'
import { View } from 'react-native'

import { AppClusterSwitcher } from '@/features/core/ui/app-cluster-switcher'
import { useTheme } from '@/features/shell/data-access/use-theme'
import { ShellUiPage } from '@/features/shell/ui/shell-ui-page'
import { ShellUiPageHeader } from '@/features/shell/ui/shell-ui-page-header'
import { ShellUiThemeSwitcher } from '@/features/shell/ui/shell-ui-theme-switcher'

export function SettingsFeatureEntry() {
  const { tintColor } = useTheme()

  return (
    <ShellUiPage>
      <ShellUiPageHeader
        description="Manage wallet preferences and app appearance from the shared shell."
        icon={<Ionicons color={tintColor} name="settings-outline" size={30} />}
        title="Settings"
      />

      <Card className="gap-4 p-5">
        <Card.Body className="gap-1">
          <View className="flex-row items-center gap-2">
            <Ionicons color={tintColor} name="color-palette-outline" size={22} />
            <Card.Title className="text-xl font-bold">Appearance</Card.Title>
          </View>
          <Card.Description className="leading-relaxed">
            Switch the app theme without leaving the Android tab shell.
          </Card.Description>
        </Card.Body>
        <ShellUiThemeSwitcher />
      </Card>

      <Card className="gap-4 p-5">
        <Card.Body className="gap-1">
          <View className="flex-row items-center gap-2">
            <Ionicons color={tintColor} name="server-outline" size={22} />
            <Card.Title className="text-xl font-bold">Cluster</Card.Title>
          </View>
          <Card.Description className="leading-relaxed">RPC and wallet authorization target.</Card.Description>
        </Card.Body>
        <AppClusterSwitcher />
      </Card>
    </ShellUiPage>
  )
}
