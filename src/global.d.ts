declare module '*.css'

interface BrowserWalletPublicKey {
  toBase58(): string
  toString(): string
}

interface BrowserSolanaWindowProvider {
  connect(options?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: BrowserWalletPublicKey }>
  disconnect(): Promise<void>
  isConnected: boolean
  isPhantom?: boolean
  isSolflare?: boolean
  off(event: 'accountChanged' | 'connect' | 'disconnect', handler: (...args: unknown[]) => void): void
  on(event: 'accountChanged' | 'connect' | 'disconnect', handler: (...args: unknown[]) => void): void
  publicKey: BrowserWalletPublicKey | null
  signMessage(message: Uint8Array, display?: 'hex' | 'utf8'): Promise<{ signature: Uint8Array }>
}

interface Window {
  phantom?: {
    solana?: BrowserSolanaWindowProvider & { isPhantom?: boolean }
  }
  solana?: BrowserSolanaWindowProvider
  solflare?: BrowserSolanaWindowProvider & { isSolflare?: boolean }
}

