import { address, type Address } from '@solana/kit'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'

import type { WalletSignMessages } from '@/features/wallet/data-access/wallet-sign-message-types'
import {
  clearStoredBrowserWalletId,
  connectBrowserWallet,
  disconnectBrowserWallet,
  getBrowserWalletProvider,
  getConnectedBrowserWalletAddress,
  getStoredBrowserWalletId,
  signBrowserWalletMessage,
  tryReconnectBrowserWallet,
  type BrowserWalletId,
} from '@/features/wallet/data-access/web-wallet-browser'

interface AppWalletAccount {
  address: Address
}

interface WebWalletContextValue {
  account: AppWalletAccount | null
  connectedWalletId: BrowserWalletId | null
  connect(walletId: BrowserWalletId): Promise<void>
  disconnect(): Promise<void>
  signMessages: WalletSignMessages
}

const WebWalletContext = createContext<WebWalletContextValue | null>(null)

export function WebWalletProvider({ children }: PropsWithChildren) {
  const [walletAddress, setWalletAddress] = useState<Address | null>(null)
  const [connectedWalletId, setConnectedWalletId] = useState<BrowserWalletId | null>(null)

  const syncConnectedAddress = useCallback((walletId: BrowserWalletId) => {
    const provider = getBrowserWalletProvider(walletId)
    setWalletAddress(provider ? getConnectedBrowserWalletAddress(provider) : null)
  }, [])

  useEffect(() => {
    let cancelled = false
    const storedWalletId = getStoredBrowserWalletId()

    if (!storedWalletId) {
      return () => {
        cancelled = true
      }
    }

    void tryReconnectBrowserWallet(storedWalletId).then((session) => {
      if (cancelled || !session) {
        return
      }

      setConnectedWalletId(session.walletId)
      setWalletAddress(session.address)
    })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!connectedWalletId) {
      return
    }

    const provider = getBrowserWalletProvider(connectedWalletId)

    if (!provider) {
      return
    }

    const handleAccountChanged = (nextPublicKey: unknown) => {
      if (!nextPublicKey) {
        clearStoredBrowserWalletId()
        setWalletAddress(null)
        setConnectedWalletId(null)
        return
      }

      if (
        typeof nextPublicKey === 'object' &&
        nextPublicKey !== null &&
        'toBase58' in nextPublicKey &&
        typeof nextPublicKey.toBase58 === 'function'
      ) {
        setWalletAddress(address(nextPublicKey.toBase58()))
        return
      }

      syncConnectedAddress(connectedWalletId)
    }

    const handleDisconnect = () => {
      clearStoredBrowserWalletId()
      setWalletAddress(null)
      setConnectedWalletId(null)
    }

    provider.on('accountChanged', handleAccountChanged)
    provider.on('disconnect', handleDisconnect)

    return () => {
      provider.off('accountChanged', handleAccountChanged)
      provider.off('disconnect', handleDisconnect)
    }
  }, [connectedWalletId, syncConnectedAddress])

  const connect = useCallback(async (walletId: BrowserWalletId) => {
    const session = await connectBrowserWallet(walletId)
    setConnectedWalletId(session.walletId)
    setWalletAddress(session.address)
  }, [])

  const disconnect = useCallback(async () => {
    if (!connectedWalletId) {
      setWalletAddress(null)
      return
    }

    await disconnectBrowserWallet(connectedWalletId)
    setConnectedWalletId(null)
    setWalletAddress(null)
  }, [connectedWalletId])

  const signMessages = useCallback<WalletSignMessages>(
    async (messageBytes) => {
      if (!connectedWalletId) {
        throw new Error('Connect a browser wallet before signing.')
      }

      return signBrowserWalletMessage(connectedWalletId, messageBytes)
    },
    [connectedWalletId],
  )

  const value = useMemo<WebWalletContextValue>(
    () => ({
      account: walletAddress ? { address: walletAddress } : null,
      connectedWalletId,
      connect,
      disconnect,
      signMessages,
    }),
    [connect, connectedWalletId, disconnect, signMessages, walletAddress],
  )

  return <WebWalletContext.Provider value={value}>{children}</WebWalletContext.Provider>
}

export function useWebWallet() {
  const context = useContext(WebWalletContext)

  if (!context) {
    throw new Error('useWebWallet must be used within WebWalletProvider')
  }

  return context
}
