import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { Button } from 'heroui-native/button'
import { Card } from 'heroui-native/card'
import { Text, View } from 'react-native'

import { ClusterUiSelect } from '@/features/cluster/ui/cluster-ui-select'
import { ShellUiPage } from '@/features/shell/ui/shell-ui-page'
import { useGetBalance } from '@/features/wallet/data-access/use-get-balance'
import { ShellUiPageHeader } from '@/features/shell/ui/shell-ui-page-header'

type ConnectedWallet = NonNullable<ReturnType<typeof useMobileWallet>['account']>

const LAMPORTS_PER_SOL = 1_000_000_000n

export function WalletFeatureEntry() {
  const { account, connect, disconnect } = useMobileWallet()

  return (
    <ShellUiPage>
      <ShellUiPageHeader title="Wallet" description={<ClusterUiSelect />} />
      {account ? (
        <ConnectedWalletCard account={account} disconnect={disconnect} />
      ) : (
        <Button size="lg" onPress={connect}>
          Connect Wallet
        </Button>
      )}
    </ShellUiPage>
  )
}

function ConnectedWalletCard({ account, disconnect }: { account: ConnectedWallet; disconnect: () => Promise<void> }) {
  const balance = useGetBalance(account.address)
  const balanceText = balance.data
    ? formatLamports(balance.data.value)
    : balance.isError
      ? 'Unable to load'
      : 'Loading...'

  return (
    <Card className="w-full gap-3 p-4">
      <Card.Body className="gap-4">
        <View className="gap-1">
          <Card.Description className="text-sm font-semibold uppercase">Connected wallet</Card.Description>
          <Text className="text-sm leading-5 text-neutral-600 dark:text-neutral-300" selectable>
            {account.address.toString()}
          </Text>
        </View>
        <View className="gap-1">
          <Card.Description className="text-sm font-semibold">Balance</Card.Description>
          <Text className="text-2xl font-bold text-neutral-900 dark:text-white">{balanceText}</Text>
        </View>
        <Button variant="danger" onPress={disconnect}>
          Disconnect Wallet
        </Button>
      </Card.Body>
    </Card>
  )
}

function formatLamports(lamports: bigint) {
  const fractional = lamports % LAMPORTS_PER_SOL
  const whole = lamports / LAMPORTS_PER_SOL

  if (fractional === 0n) {
    return `${whole.toLocaleString()} SOL`
  }

  const fractionalDisplay = fractional.toString().padStart(9, '0').replace(/0+$/, '')
  return `${whole.toLocaleString()}.${fractionalDisplay} SOL`
}
