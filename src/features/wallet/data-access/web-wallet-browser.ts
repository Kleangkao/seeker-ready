import { address, type Address } from '@solana/kit'

export type BrowserWalletId = 'phantom' | 'solflare'

export interface BrowserSolanaProvider {
  connect(options?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: BrowserWalletPublicKey }>
  disconnect(): Promise<void>
  isConnected: boolean
  off(event: 'accountChanged' | 'connect' | 'disconnect', handler: (...args: unknown[]) => void): void
  on(event: 'accountChanged' | 'connect' | 'disconnect', handler: (...args: unknown[]) => void): void
  publicKey: BrowserWalletPublicKey | null
  signMessage(message: Uint8Array, display?: 'hex' | 'utf8'): Promise<{ signature: Uint8Array }>
}

interface BrowserWalletPublicKey {
  toBase58(): string
  toString(): string
}

export interface BrowserWalletCatalogItem {
  id: BrowserWalletId
  installUrl: string
  isAvailable: boolean
  label: string
}

const BROWSER_WALLET_STORAGE_KEY = 'seeker-ready:browser-wallet-id'

const BROWSER_WALLETS = [
  {
    id: 'phantom' as const,
    installUrl: 'https://phantom.app/',
    label: 'Phantom',
  },
  {
    id: 'solflare' as const,
    installUrl: 'https://solflare.com/',
    label: 'Solflare',
  },
] as const

export class BrowserWalletUnavailableError extends Error {
  constructor(walletLabel: string) {
    super(
      `${walletLabel} is not available in this browser. Install the extension or open this page in the wallet app.`,
    )
    this.name = 'BrowserWalletUnavailableError'
  }
}

/** @deprecated Use BrowserWalletUnavailableError */
export class BrowserWalletNotFoundError extends Error {
  constructor() {
    super(
      'No browser wallet found. Install Phantom or Solflare, or open this page in a wallet in-app browser.',
    )
    this.name = 'BrowserWalletNotFoundError'
  }
}

function isBrowserSolanaProvider(value: unknown): value is BrowserSolanaProvider {
  return (
    typeof value === 'object' &&
    value !== null &&
    'connect' in value &&
    typeof value.connect === 'function' &&
    'signMessage' in value &&
    typeof value.signMessage === 'function'
  )
}

export function getBrowserWalletProvider(walletId: BrowserWalletId): BrowserSolanaProvider | null {
  if (typeof window === 'undefined') {
    return null
  }

  const candidate =
    walletId === 'phantom' ? window.phantom?.solana : walletId === 'solflare' ? window.solflare : null

  return isBrowserSolanaProvider(candidate) ? candidate : null
}

export function getBrowserWalletCatalog(): BrowserWalletCatalogItem[] {
  return BROWSER_WALLETS.map((wallet) => ({
    ...wallet,
    isAvailable: getBrowserWalletProvider(wallet.id) !== null,
  }))
}

export function getBrowserWalletLabel(walletId: BrowserWalletId) {
  return BROWSER_WALLETS.find((wallet) => wallet.id === walletId)?.label ?? walletId
}

export function getStoredBrowserWalletId(): BrowserWalletId | null {
  if (typeof window === 'undefined') {
    return null
  }

  const stored = window.sessionStorage.getItem(BROWSER_WALLET_STORAGE_KEY)

  if (stored === 'phantom' || stored === 'solflare') {
    return stored
  }

  return null
}

function setStoredBrowserWalletId(walletId: BrowserWalletId | null) {
  if (typeof window === 'undefined') {
    return
  }

  if (walletId) {
    window.sessionStorage.setItem(BROWSER_WALLET_STORAGE_KEY, walletId)
    return
  }

  window.sessionStorage.removeItem(BROWSER_WALLET_STORAGE_KEY)
}

export function clearStoredBrowserWalletId() {
  setStoredBrowserWalletId(null)
}

function normalizeSignatureBytes(signature: unknown): Uint8Array {
  if (signature instanceof Uint8Array) {
    return signature
  }

  if (Array.isArray(signature)) {
    return Uint8Array.from(signature)
  }

  throw new Error('The wallet returned an unexpected signature format.')
}

export function getConnectedBrowserWalletAddress(provider: BrowserSolanaProvider): Address | null {
  if (!provider.isConnected || !provider.publicKey) {
    return null
  }

  return address(provider.publicKey.toBase58())
}

export async function connectBrowserWallet(walletId: BrowserWalletId) {
  const provider = getBrowserWalletProvider(walletId)
  const walletLabel = getBrowserWalletLabel(walletId)

  if (!provider) {
    throw new BrowserWalletUnavailableError(walletLabel)
  }

  const response = await provider.connect()
  setStoredBrowserWalletId(walletId)
  return {
    address: address(response.publicKey.toBase58()),
    walletId,
  }
}

export async function disconnectBrowserWallet(walletId: BrowserWalletId) {
  const provider = getBrowserWalletProvider(walletId)

  if (!provider) {
    return
  }

  await provider.disconnect()
  setStoredBrowserWalletId(null)
}

export async function signBrowserWalletMessage(walletId: BrowserWalletId, messageBytes: Uint8Array) {
  const provider = getBrowserWalletProvider(walletId)

  if (!provider?.isConnected || !provider.publicKey) {
    throw new Error('Connect a browser wallet before signing.')
  }

  const { signature } = await provider.signMessage(messageBytes, 'utf8')
  return normalizeSignatureBytes(signature)
}

export async function tryReconnectBrowserWallet(walletId: BrowserWalletId) {
  const provider = getBrowserWalletProvider(walletId)

  if (!provider) {
    clearStoredBrowserWalletId()
    return null
  }

  try {
    await provider.connect({ onlyIfTrusted: true })
    const nextAddress = getConnectedBrowserWalletAddress(provider)

    if (!nextAddress) {
      clearStoredBrowserWalletId()
      return null
    }

    setStoredBrowserWalletId(walletId)
    return {
      address: nextAddress,
      walletId,
    }
  } catch {
    clearStoredBrowserWalletId()
    return null
  }
}
