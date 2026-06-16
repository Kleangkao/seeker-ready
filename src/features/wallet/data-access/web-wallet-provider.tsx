import type { PropsWithChildren } from 'react'

export function WebWalletProvider({ children }: PropsWithChildren) {
  return children
}

export function useWebWallet(): never {
  throw new Error('useWebWallet is only available on web')
}
