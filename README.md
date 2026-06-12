# Seeker Ready

Post-unboxing readiness companion for Solana Mobile users.

Seeker Ready helps new Seeker users, workshop participants, and Solana Mobile builders work through a short checklist before they start using real dApps — connect a wallet, try a safe signature test, read short concept cards, open trusted resources, and confirm basic safety habits.

**This is not official Seeker onboarding.** It is a practical readiness companion and workshop-friendly setup checker. It does not verify Seeker Genesis Token (SGT) ownership, run scanners, offer rewards, or replace Solana Mobile documentation.

## What it does

- Shows a readiness checklist as the first screen (`x/8 ready` on device)
- Connects a wallet through Mobile Wallet Adapter (MWA) on Android
- Runs a safe sign-message test with local signature verification (no funds moved)
- Explains key Solana Mobile concepts in short self-check cards
- Links to trusted official resources
- Tracks basic safety habits and local checklist progress
- Shows a **Seeker Ready** completion state when all steps are genuinely complete

## Web preview vs Android testing

| Environment | What you can test |
|-------------|-------------------|
| **Web preview** | Layout, navigation, learning steps (6/6 self-check), trusted resources, safety habits, reset, and persistence |
| **Android + MWA wallet** | Real wallet connect, safe sign-message, local signature verification, and full `8/8` completion |

Web preview activates automatically and shows **Learning steps: x/6** plus **Wallet ready: 0/2 — requires Android + MWA**. Wallet connect and sign-message **cannot be fully verified on web** — those steps require Android with an MWA-compatible wallet. Web preview does not mock wallet behavior or show a fake completion badge.

## QA status

| Pass | Status |
|------|--------|
| Static review (types, lint, scope) | Passed |
| Web / no-device QA | Passed — see [NO_DEVICE_QA.md](./NO_DEVICE_QA.md) |
| Android + MWA device QA | **Pending** — see [MANUAL_QA.md](./MANUAL_QA.md) |

**Summary:** Static + web/no-device QA has passed. Android/MWA device QA is still pending before release.

## Get started

### Requirements

- **Custom Expo development build required** — not intended for plain Expo Go.
- **Android device** with a compatible Mobile Wallet Adapter (MWA) wallet for real wallet testing.
- Web preview is optional and limited to learning/safety/resource QA.

### Run locally

1. Install dependencies

   ```bash
   npm install --legacy-peer-deps
   ```

2. Web preview (learning/safety QA only)

   ```bash
   npm run web
   ```

3. Android dev client + device testing

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

- Readiness checklist with progress (`x/8 ready` on device)
- Wallet connect via MWA (Android)
- Safe sign-message test with local signature verification
- Short concept cards (MWA, Seed Vault, dApp Store, Seeker ID)
- Trusted resource links (open at least one)
- Basic safety self-check habits
- Local MMKV-backed progress persistence
- Web preview mode for no-device QA
- Completion badge when all steps are genuinely complete

**Not included:**

- Official Solana Mobile onboarding
- SGT / Seeker ownership verification
- Token or address scanners
- Safety Lens / scam or risk detection
- Rewards or claim systems
- Backend Sign-In With Solana (SIWS)
- Mock wallet or fake signature flows
- Curated dApp recommendations

## Screenshots / walkthrough

| Screen | Status | Notes |
|--------|--------|-------|
| Web preview banner | Ready to capture now | Preview mode + split Learning 6/6 / Wallet 0/2 |
| Ready checklist | Ready to capture now | Full step list with honest self-check wording |
| Learning 6/6 | Ready to capture now | Concept cards marked **Read**, resources and safety complete |
| Settings | Ready to capture now | Theme, cluster, reset, and **Testing without Seeker** card |
| Android wallet flow | **Pending device QA** | Capture after Android + MWA QA passes — connect wallet + signature verified |

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
- [NO_DEVICE_QA.md](./NO_DEVICE_QA.md) — web/static QA
- [MANUAL_QA.md](./MANUAL_QA.md) — Android + MWA QA
