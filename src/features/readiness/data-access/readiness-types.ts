import type Ionicons from '@expo/vector-icons/Ionicons'

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

export type SafetyHabitId =
  | 'noSeedShare'
  | 'readPrompts'
  | 'officialLinks'
  | 'checkPublisher'
  | 'testSmall'
  | 'unknownQr'

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
    noSeedShare: false,
    readPrompts: false,
    officialLinks: false,
    checkPublisher: false,
    testSmall: false,
    unknownQr: false,
  },
}

export const SAFETY_HABITS: {
  id: SafetyHabitId
  icon: keyof typeof Ionicons.glyphMap
  label: string
}[] = [
  { id: 'noSeedShare', icon: 'lock-closed-outline', label: 'Never share your seed phrase' },
  { id: 'readPrompts', icon: 'document-text-outline', label: 'Read wallet prompts carefully before signing' },
  { id: 'officialLinks', icon: 'link-outline', label: 'Use official links' },
  {
    id: 'checkPublisher',
    icon: 'storefront-outline',
    label: 'Check the app name and publisher before installing',
  },
  { id: 'testSmall', icon: 'flask-outline', label: 'Test small actions before trusting a new app' },
  { id: 'unknownQr', icon: 'qr-code-outline', label: 'Be careful with unknown QR codes and addresses' },
]

export const TRUSTED_RESOURCES = [
  {
    title: 'Solana Mobile Docs',
    url: 'https://docs.solanamobile.com/',
    description: 'Official docs for Solana Mobile products and developer tools.',
    useWhen: 'Use when you need background on Seeker, mobile wallets, or the stack.',
  },
  {
    title: 'Seeker',
    url: 'https://docs.solanamobile.com/solana-mobile-stack/seeker',
    description: 'What the Seeker device includes and how the stack works on it.',
    useWhen: 'Use when setting up or learning what your phone ships with.',
  },
  {
    title: 'Mobile Wallet Adapter',
    url: 'https://docs.solanamobile.com/developers/mobile-wallet-adapter',
    description: 'How apps connect to mobile wallets through MWA.',
    useWhen: 'Use when connect or sign prompts need a quick explanation.',
  },
  {
    title: 'dApp Publishing',
    url: 'https://publish.solanamobile.com/',
    description: 'Official portal for publishing to the Solana dApp Store.',
    useWhen: 'Use when checking where mobile dApps come from.',
  },
] as const

export const READINESS_CONCEPTS = [
  {
    step: 'understandMwa' as const,
    title: 'Mobile Wallet Adapter',
    icon: 'phone-portrait-outline' as const,
    summary: 'Connects apps to your mobile wallet without exposing private keys.',
    whyItMatters: 'You stay in control of approvals and can see what each app requests.',
    remember: 'Read every connect and sign prompt before you approve.',
  },
  {
    step: 'understandSeedVault' as const,
    title: 'Seed Vault',
    icon: 'key-outline' as const,
    summary: 'Solana Mobile’s secure layer for protecting wallet keys on your device.',
    whyItMatters: 'Your keys stay protected by hardware-backed security on supported devices.',
    remember: 'Your seed phrase unlocks your wallet — never share it with apps or websites.',
  },
  {
    step: 'understandDappStore' as const,
    title: 'Solana dApp Store',
    icon: 'apps-outline' as const,
    summary: 'A mobile app store focused on crypto-friendly dApps.',
    whyItMatters: 'Apps are reviewed for store policies — a clearer starting point than random APKs.',
    remember: 'Still check the app name and publisher before you install.',
  },
  {
    step: 'understandSeekerId' as const,
    title: 'Seeker ID',
    icon: 'id-card-outline' as const,
    summary: 'Seeker Genesis Token (SGT) and identity tied to Seeker devices and users.',
    whyItMatters: 'Some apps may recognize Seeker users; understanding this sets expectations.',
    remember: 'This app does not verify SGT ownership — treat identity claims carefully.',
  },
] as const

export const SAFE_SIGN_MESSAGE =
  'I am testing wallet signing in Seeker Ready. This does not move funds.'
