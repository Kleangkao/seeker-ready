import type { BrowserWalletId } from '@/features/wallet/data-access/web-wallet-browser'

export type WalletUiBrowserConnectProps = {
  connect: (walletId: BrowserWalletId) => Promise<void>
}

export type AppWalletConnect = (walletId?: BrowserWalletId) => Promise<void>
