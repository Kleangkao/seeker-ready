import Ionicons from '@expo/vector-icons/Ionicons'
import type { Lamports } from '@solana/kit'
import { Account } from '@wallet-ui/react-native-kit'
import { Button } from 'heroui-native/button'
import { Card } from 'heroui-native/card'
import { Text, View } from 'react-native'

import { useTheme } from '@/features/shell/data-access/use-theme'
import { useGetBalance } from '@/features/wallet/data-access/use-get-balance'
import { formatError } from './util/format-error'
import { WalletUiStatusAlert } from './ui/wallet-ui-status-alert'

export const LAMPORTS_PER_SOL = 1_000_000_000n
function formatLamports(lamports: Lamports) {
  const fractional = lamports % LAMPORTS_PER_SOL
  const whole = lamports / LAMPORTS_PER_SOL

  if (fractional === 0n) {
    return `${whole.toLocaleString()} SOL`
  }

  const fractionalDisplay = fractional.toString().padStart(9, '0').replace(/0+$/, '')
  return `${whole.toLocaleString()}.${fractionalDisplay} SOL`
}

export function WalletFeatureBalance({ account }: { account: Account }) {
  const balance = useGetBalance(account.address)
  const { tintColor } = useTheme()
  const balanceText =
    balance.data?.value !== undefined
      ? formatLamports(balance.data.value)
      : balance.isError
        ? 'Unable to load'
        : 'Loading...'

  return (
    <Card className="w-full gap-3 p-4">
      <Card.Body className="gap-3">
        <View className="gap-1">
          <View className="flex-row items-center gap-2">
            <Ionicons color={tintColor} name="cash-outline" size={22} />
            <Card.Title className="text-xl font-bold">Balance</Card.Title>
          </View>
          <Card.Description className="leading-relaxed">Confirmed balance for the connected account.</Card.Description>
        </View>
        <View className="gap-1">
          <Text className="text-2xl font-bold text-neutral-900 dark:text-white">{balanceText}</Text>
          {balance.data?.value !== undefined ? (
            <Text className="text-sm text-neutral-600 dark:text-neutral-300">
              {balance.data.value.toLocaleString()} lamports
            </Text>
          ) : null}
        </View>
        {balance.isError ? (
          <WalletUiStatusAlert description={formatError(balance.error)} status="danger" title="Balance error" />
        ) : null}
        <Button isDisabled={balance.isFetching} variant="outline" onPress={() => void balance.refetch()}>
          {balance.isFetching ? 'Refreshing...' : 'Refresh Balance'}
        </Button>
      </Card.Body>
    </Card>
  )
}
