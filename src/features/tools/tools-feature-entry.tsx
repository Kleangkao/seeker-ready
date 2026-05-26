import Ionicons from '@expo/vector-icons/Ionicons'
import { Card } from 'heroui-native/card'
import { View } from 'react-native'

import { useTheme } from '@/features/shell/data-access/use-theme'
import { ShellUiPage } from '@/features/shell/ui/shell-ui-page'
import { ShellUiPageHeader } from '@/features/shell/ui/shell-ui-page-header'

export function ToolsFeatureEntry() {
  const { tintColor } = useTheme()

  return (
    <ShellUiPage>
      <ShellUiPageHeader
        description="Developer and wallet utilities stay grouped behind a dedicated Android tab."
        icon={<Ionicons color={tintColor} name="construct-outline" size={30} />}
        title="Tools"
      />

      <Card className="gap-2 p-5">
        <View className="flex-row items-center gap-2">
          <Ionicons color={tintColor} name="swap-horizontal-outline" size={22} />
          <Card.Title className="text-xl font-bold">Transaction tools</Card.Title>
        </View>
        <Card.Description className="leading-relaxed">
          Add builders, simulators, or signing utilities here while keeping wallet access one tab away.
        </Card.Description>
      </Card>

      <Card className="gap-2 p-5">
        <View className="flex-row items-center gap-2">
          <Ionicons color={tintColor} name="pulse-outline" size={22} />
          <Card.Title className="text-xl font-bold">Network tools</Card.Title>
        </View>
        <Card.Description className="leading-relaxed">
          Cluster status, address lookup, and developer helpers can live in this workspace.
        </Card.Description>
      </Card>
    </ShellUiPage>
  )
}
