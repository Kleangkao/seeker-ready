import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { useCallback } from 'react'

import type { BrowserWalletId } from '@/features/wallet/data-access/web-wallet-browser'

export function useAppWallet() {
  const { account, connect: connectMwa, disconnect, signMessages } = useMobileWallet()
  const connect = useCallback(
    async (_walletId?: BrowserWalletId) => {
      await connectMwa()
    },
    [connectMwa],
  )

  return {
    account,
    connect,
    connectedWalletLabel: null,
    disconnect,
    isBrowserWallet: false,
    signMessages,
  }
}
