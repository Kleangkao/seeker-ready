import { useWebWallet } from '@/features/wallet/data-access/web-wallet-provider'
import { getBrowserWalletLabel } from '@/features/wallet/data-access/web-wallet-browser'

export function useAppWallet() {
  const { account, connect, connectedWalletId, disconnect, signMessages } = useWebWallet()

  return {
    account,
    connect,
    connectedWalletLabel: connectedWalletId ? getBrowserWalletLabel(connectedWalletId) : null,
    disconnect,
    isBrowserWallet: true,
    signMessages,
  }
}
