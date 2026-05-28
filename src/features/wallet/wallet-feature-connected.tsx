import type { Account, useMobileWallet } from '@wallet-ui/react-native-kit'
import { View } from 'react-native'

import { WalletFeatureAccount } from '@/features/wallet/wallet-feature-account'
import { WalletFeatureBalance } from '@/features/wallet/wallet-feature-balance'

export function WalletFeatureConnected({
  account,
  wallet,
}: {
  account: Account
  wallet: ReturnType<typeof useMobileWallet>
}) {
  return (
    <View className="gap-6">
      <WalletFeatureAccount account={account} disconnect={wallet.disconnect} />
      <WalletFeatureBalance account={account} />
    </View>
  )
}
