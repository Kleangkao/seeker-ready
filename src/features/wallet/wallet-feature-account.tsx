import Ionicons from '@expo/vector-icons/Ionicons'
import { Account } from '@wallet-ui/react-native-kit'
import { Button } from 'heroui-native/button'
import { Card } from 'heroui-native/card'
import { Text, View } from 'react-native'

import { useTheme } from '@/features/shell/data-access/use-theme'

export function WalletFeatureAccount({ account, disconnect }: { account: Account; disconnect: () => Promise<void> }) {
  const label = account.label ?? 'Mobile wallet'
  const { tintColor } = useTheme()

  return (
    <Card className="w-full gap-3 p-4">
      <Card.Body className="gap-4">
        <View className="gap-1">
          <Card.Description className="text-sm font-semibold uppercase">Connected wallet</Card.Description>
          <View className="flex-row items-center gap-2">
            <Ionicons color={tintColor} name="wallet-outline" size={22} />
            <Card.Title className="text-xl font-bold">{label}</Card.Title>
          </View>
          <Text className="text-sm leading-5 text-neutral-600 dark:text-neutral-300" selectable>
            {account.address.toString()}
          </Text>
        </View>
        <Button variant="danger" onPress={disconnect}>
          Disconnect Wallet
        </Button>
      </Card.Body>
    </Card>
  )
}
