# Seeker Ready

Post-unboxing readiness companion for Solana Mobile users.

Seeker Ready helps new Seeker users, workshop participants, and Solana Mobile builders work through a short checklist before they start using real dApps — connect a wallet, try a safe signature test, read short concept cards, open trusted resources, and confirm basic safety habits.

**This is not official Seeker onboarding.** It is a practical readiness companion and workshop-friendly setup checker. It does not verify Seeker Genesis Token (SGT) ownership, run scanners, offer rewards, certify device security, or replace Solana Mobile documentation.

## What it does

- Shows a readiness checklist as the first screen (`x/8 ready`)
- **Android / native:** connects a wallet through Mobile Wallet Adapter (MWA)
- **Web:** connects Phantom or Solflare as browser wallets for readiness testing
- Runs a **safe sign-message test only** with local signature verification (no transactions, no SOL spent)
- Explains key Solana Mobile concepts in short self-check cards
- Links to trusted official resources
- Tracks basic safety habits and local checklist progress
- Shows a completion state when all steps are genuinely complete:
  - **Android / native:** **Seeker Ready**
  - **Web:** **Browser wallet readiness complete** (not the same as full Seeker device readiness)

## Web vs Android testing

Browser wallet mode on web is **not** the same as Android Mobile Wallet Adapter. Web does not prove Seed Vault, Seeker hardware, or production MWA behavior.

| Environment | What you can test |
|-------------|-------------------|
| **Web (browser)** | Full `8/8` checklist with Phantom or Solflare: browser wallet connect, safe sign-message, concept cards, trusted resources, safety habits, reset, and local persistence. Completion means **browser wallet readiness**, not Seeker device readiness. |
| **Android + MWA wallet** | Real MWA connect, safe sign-message, local signature verification, full `8/8` completion as **Seeker Ready**, and validation closer to Seeker / Seed Vault / production MWA behavior |

Real Seeker, Seed Vault, and production MWA confidence still requires Android device testing — see [MANUAL_QA.md](./MANUAL_QA.md).

Web wallet QA checklist: [NO_DEVICE_QA.md](./NO_DEVICE_QA.md#section-d--web-browser-wallet-qa).

## QA status

| Pass | Status |
|------|--------|
| Static review (types, lint, scope) | Passed |
| Web / no-device QA (UI, static, browser wallet checklist) | See [NO_DEVICE_QA.md](./NO_DEVICE_QA.md) |
| Android + MWA device QA (Seeker / Seed Vault / production MWA) | **Pending** — see [MANUAL_QA.md](./MANUAL_QA.md) |
| Emulator + Mock MWA | **Passed** `8/8` (2026-06-14) — not production-equivalent |

**Summary:** Code supports both web browser wallets and Android MWA. Emulator MWA passed with Mock MWA Wallet. Real Seeker / Seed Vault device QA is still pending before release.

## Get started

### Requirements

- **Custom Expo development build** on Android — not intended for plain Expo Go.
- **Android device** with a compatible MWA wallet for Seeker / MWA validation.
- **Web:** Chrome or another desktop browser with the **Phantom** and/or **Solflare** extension for browser wallet testing (optional; no Android required for that path).

### Run locally

1. Install dependencies

   ```bash
   npm install --legacy-peer-deps
   ```

2. Web (browser wallet + full checklist)

   ```bash
   npm run web
   ```

   Open the local URL, install Phantom and/or Solflare if needed, then use **Connect wallet** on the Ready tab.

3. Android dev client + MWA testing

   ```bash
   npm run dev
   npm run android
   ```

   Open the installed **Seeker Ready** dev build on your device — do not use Expo Go for MWA testing.

### Maintainer scripts

Regenerate compressed app icons and the Android monochrome glyph after changing source artwork:

```bash
npm run optimize:assets
```

## MVP scope

**Included:**

- Readiness checklist with progress (`x/8 ready`)
- Wallet connect via MWA on Android / native
- Browser wallet connect on web (Phantom and Solflare)
- Safe sign-message test with local signature verification (no on-chain transactions)
- Short concept cards (MWA, Seed Vault, dApp Store, Seeker ID)
- Trusted resource links (open at least one)
- Basic safety self-check habits
- Local progress persistence (MMKV on native, `localStorage` on web)
- Platform-honest completion badge

**Not included:**

- Official Solana Mobile onboarding
- SGT / Seeker ownership verification
- Seed Vault verification on web
- Token or address scanners
- Safety Lens / scam or risk detection
- Rewards or claim systems
- Backend Sign-In With Solana (SIWS)
- On-chain transactions or SOL spends
- Mock wallet or fake signature flows
- Curated dApp recommendations
- Production security certification

## Screenshots / walkthrough

| Screen | Status | Notes |
|--------|--------|-------|
| Ready checklist (web) | Ready to capture | Unified `x/8` progress; Connect wallet opens browser wallet modal |
| Browser wallet modal | Ready to capture | Phantom / Solflare logos with Connect or Install |
| Web completion badge | Ready to capture | **Browser wallet readiness complete** |
| Ready checklist (Android) | Ready to capture | MWA connect + sign-message flow |
| Android completion badge | **Pending real device QA** | **Seeker Ready** after `8/8` on Seeker / Seed Vault |
| Settings | Ready to capture | Theme, cluster, reset, testing guidance |

## App identity

| Field | Value |
|-------|-------|
| Display name | Seeker Ready |
| Slug / scheme | `seeker-ready` |
| Android package | `com.seekerready.app` |
| MWA app identity | Seeker Ready (`seekerready://seeker-ready`) |

## Technologies

- [Expo](https://expo.dev)
- [Uniwind](https://uniwind.dev/) (Tailwind CSS for React Native)
- [@solana/kit](https://github.com/anza-xyz/kit)
- [@wallet-ui/react-native-kit](https://github.com/wallet-ui/wallet-ui)

## Learn more

- [Solana Mobile documentation](https://docs.solanamobile.com/)
- [Expo documentation](https://docs.expo.dev/)
- [NO_DEVICE_QA.md](./NO_DEVICE_QA.md) — web, static, and browser wallet QA
- [MANUAL_QA.md](./MANUAL_QA.md) — Android + MWA QA
- [EMULATOR_QA.md](./EMULATOR_QA.md) — emulator and Mock MWA notes
