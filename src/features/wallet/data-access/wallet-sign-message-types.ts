export type WalletSignMessages = (message: Uint8Array) => Promise<Uint8Array | Uint8Array[] | undefined>
