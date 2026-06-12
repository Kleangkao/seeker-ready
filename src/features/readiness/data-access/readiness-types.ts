export const READINESS_STEPS = [
  'connectWallet',
  'safeSignature',
  'understandMwa',
  'understandSeedVault',
  'understandDappStore',
  'understandSeekerId',
  'trustedResources',
  'safetyHabits',
] as const

export const LEARNING_READINESS_STEPS = [
  'understandMwa',
  'understandSeedVault',
  'understandDappStore',
  'understandSeekerId',
  'trustedResources',
  'safetyHabits',
] as const satisfies readonly ReadinessStepId[]

export const WALLET_READINESS_STEPS = [
  'connectWallet',
  'safeSignature',
] as const satisfies readonly ReadinessStepId[]

export type ReadinessStepId = (typeof READINESS_STEPS)[number]

export type SafetyHabitId = 'readPrompts' | 'officialLinks' | 'unknownQr' | 'noSeedShare' | 'testSmall'

export type ReadinessProgress = {
  connectWallet: boolean
  safeSignature: boolean
  understandMwa: boolean
  understandSeedVault: boolean
  understandDappStore: boolean
  understandSeekerId: boolean
  trustedResources: boolean
  safetyHabits: Record<SafetyHabitId, boolean>
}

export const DEFAULT_READINESS_PROGRESS: ReadinessProgress = {
  connectWallet: false,
  safeSignature: false,
  understandMwa: false,
  understandSeedVault: false,
  understandDappStore: false,
  understandSeekerId: false,
  trustedResources: false,
  safetyHabits: {
    readPrompts: false,
    officialLinks: false,
    unknownQr: false,
    noSeedShare: false,
    testSmall: false,
  },
}

export const SAFETY_HABITS: { id: SafetyHabitId; label: string }[] = [
  { id: 'readPrompts', label: 'Read wallet prompts before signing' },
  { id: 'officialLinks', label: 'Prefer official links' },
  { id: 'unknownQr', label: 'Be careful with unknown QR codes and addresses' },
  { id: 'noSeedShare', label: 'Do not share seed phrases' },
  { id: 'testSmall', label: 'Test small actions before trusting a new app' },
]

export const TRUSTED_RESOURCES = [
  { title: 'Solana Mobile Docs', url: 'https://docs.solanamobile.com/' },
  { title: 'Seeker', url: 'https://docs.solanamobile.com/solana-mobile-stack/seeker' },
  {
    title: 'Mobile Wallet Adapter',
    url: 'https://docs.solanamobile.com/developers/mobile-wallet-adapter',
  },
  { title: 'dApp Publishing', url: 'https://publish.solanamobile.com/' },
] as const

export const READINESS_CONCEPTS = [
  {
    step: 'understandMwa' as const,
    title: 'Mobile Wallet Adapter',
    body: 'MWA lets this app connect to your mobile wallet without touching your private keys.',
  },
  {
    step: 'understandSeedVault' as const,
    title: 'Seed Vault',
    body: "Seed Vault is Solana Mobile's secure key layer for protecting wallet secrets on the device.",
  },
  {
    step: 'understandDappStore' as const,
    title: 'Solana dApp Store',
    body: 'The Solana dApp Store is a crypto-friendly app store for mobile dApps.',
  },
  {
    step: 'understandSeekerId' as const,
    title: 'Seeker Genesis Token / Seeker ID',
    body: 'Seeker identity concepts can help apps recognize Seeker users, but this MVP does not verify ownership yet.',
  },
] as const

export const SAFE_SIGN_MESSAGE =
  'I am testing wallet signing in Seeker Ready. This does not move funds.'
