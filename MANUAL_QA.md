# Seeker Ready — Manual QA Checklist

Use this checklist on an **Android custom Expo development build** with a **compatible Mobile Wallet Adapter (MWA) wallet** (for example Seed Vault on Seeker, or another MWA-capable wallet in your test environment).

**Do not use Expo Go** for this pass. MWA connect and sign-message require native wallet integration.

> **Web browser wallet testing?** Use [NO_DEVICE_QA.md](./NO_DEVICE_QA.md) Section D (Phantom / Solflare). Web completion is **Browser wallet readiness complete** — it does not validate Seeker, Seed Vault, or production MWA.
>
> **No Android device?** Start with [NO_DEVICE_QA.md](./NO_DEVICE_QA.md) for web and static checks.
>
> **Android Emulator (non-wallet)?** See [EMULATOR_QA.md](./EMULATOR_QA.md) — learning steps, persistence, and reset **passed** on `SeekerReady_Pixel7_API34`.
>
> **Android Emulator (Mock MWA Wallet)?** **Full `8/8` passed** on `SeekerReady_Pixel7_API34` (2026-06-14): MWA connect, safe sign-message, local signature verification, concept cards, trusted resources, safety self-check, completion badge, and persistence after restart all **passed**. Pre-fix verification failed with *Could not decode the signed message* (MWA raw 64-byte Ed25519 signature vs off-chain envelope mismatch) — **fixed** in `execute-wallet-sign-message.tsx` without bypassing verification. See [EMULATOR_QA.md](./EMULATOR_QA.md). **Real Seeker / Seed Vault device QA remains pending** — Mock MWA is not production-equivalent.

## Emulator QA summary (Mock MWA — 2026-06-14)

Full manual pass on Android Emulator (`SeekerReady_Pixel7_API34`, `com.solana.mwallet`):

| Area | Result |
|------|--------|
| Full emulator QA (`8/8`) | **Pass** |
| MWA connect | **Pass** |
| Safe sign-message | **Pass** |
| Local signature verification | **Pass** |
| Concept cards | **Pass** |
| Trusted resource step | **Pass** |
| Safety self-check | **Pass** |
| Full `8/8` completion badge | **Pass** |
| Persistence after restart | **Pass** |
| Real Seeker / Seed Vault QA | **Pending** — Mock MWA is not production-equivalent |

**Root cause (pre-fix):** MWA `sign_messages` returned a raw 64-byte Ed25519 signature; Seeker Ready tried to decode it as a Solana off-chain message envelope.

**Fix:** `execute-wallet-sign-message.tsx` now supports raw MWA signature format (and `message || signature` concatenation) while keeping full local verification via `@solana/kit` `verifySignature`. Off-chain envelope path retained for compatible wallets.

---

## Prerequisites

- [ ] Dependencies installed: `npm install --legacy-peer-deps`
- [ ] Android device or emulator with a compatible MWA wallet available
- [ ] USB debugging enabled (physical device) or emulator configured
- [ ] Dev build installed on device: `npm run android`

## Environment setup

1. Start Metro for the dev client:

   ```bash
   npm run dev
   ```

2. Open the installed **Seeker Ready** dev build on your Android device (not Expo Go).

3. Optional: note starting checklist state (fresh install should show `0/8 ready`).

---

## 1. First launch and navigation

| # | Step | Expected | Pass |
|---|------|----------|------|
| 1.1 | Open the app for the first time | **Ready** tab is shown immediately | [ ] |
| 1.2 | Check the main screen | Readiness checklist with progress header (`x/8 ready`) — not a wallet demo | [ ] |
| 1.3 | Check bottom tabs | Only **Ready** and **Settings** tabs are visible | [ ] |
| 1.4 | Confirm no demo surfaces | No Wallet demo, Tools tab, Activity, balance card, or scanner UI | [ ] |

---

## 2. Wallet connect (MWA)

*Emulator (Mock MWA, 2026-06-14): sections 2.1–2.4 **passed**.*

| # | Step | Expected | Pass |
|---|------|----------|------|
| 2.1 | On Ready tab, find **Connect wallet** | Step card with connect action visible | [x] emulator |
| 2.2 | Tap **Connect Wallet** | MWA wallet picker / authorization flow opens | [x] emulator |
| 2.3 | Approve connection in wallet | App shows live status: `Connected: xxxx...xxxx` (shortened address) | [x] emulator |
| 2.4 | Check step completion | **Connect wallet** step shows complete (checkmark / Done) | [x] emulator |
| 2.5 | Disconnect wallet (optional) | Live status changes to `Not connected right now` | [ ] |
| 2.6 | Confirm step still complete after disconnect | Connect wallet step remains complete if already achieved once | [ ] |

---

## 3. Connect wallet persistence (reload)

*Emulator (Mock MWA, 2026-06-14): connect step persistence **passed** as part of wallet re-test.*

| # | Step | Expected | Pass |
|---|------|----------|------|
| 3.1 | Complete **Connect wallet** at least once | Step marked complete | [x] emulator |
| 3.2 | Force-close the app completely | App is not running in background | [x] emulator |
| 3.3 | Reopen the app | Ready checklist loads | [x] emulator |
| 3.4 | Check connect step | **Connect wallet** step still complete even if MWA session not restored | [x] emulator |
| 3.5 | Check live status | Shows `Connected: ...` or `Not connected right now` accurately | [ ] |

---

## 4. Safe sign-message

*Emulator (Mock MWA, 2026-06-14): sections 4.1–4.6 **passed**.*

| # | Step | Expected | Pass |
|---|------|----------|------|
| 4.1 | Reconnect wallet if needed | Live connection active | [x] emulator |
| 4.2 | Open **Test safe signature** step | Fixed message shown exactly: `I am testing wallet signing in Seeker Ready. This does not move funds.` | [x] emulator |
| 4.3 | Read helper copy | UI states signing does not spend tokens or move funds | [x] emulator |
| 4.4 | Tap **Test safe signature** | Wallet signing prompt appears | [x] emulator |
| 4.5 | Approve signature in wallet | Success feedback; step marked complete | [x] emulator |
| 4.6 | Reload app | **Test safe signature** step remains complete | [x] emulator |

---

## 5. Concept cards, resources, and safety habits

*Emulator (Mock MWA, 2026-06-14): sections 5.1–5.6 **passed**.*

| # | Step | Expected | Pass |
|---|------|----------|------|
| 5.1 | Tap **Got it** on each concept card | MWA, Seed Vault, dApp Store, Seeker ID steps complete | [x] emulator |
| 5.2 | Tap any trusted resource link | External browser opens official URL | [x] emulator |
| 5.3 | Return to app | **Open trusted resources** step complete | [x] emulator |
| 5.4 | Check all **6** safety habit items | Each toggles on tap | [x] emulator |
| 5.5 | Complete all habits | **Complete basic safety habits** step shows complete | [x] emulator |
| 5.6 | Reload app | Concept, resource, and safety progress persists | [x] emulator |

---

## 6. Completion badge persistence

*Emulator (Mock MWA, 2026-06-14): sections 6.1–6.4 **passed**.*

| # | Step | Expected | Pass |
|---|------|----------|------|
| 6.1 | Complete all 8 checklist steps | Progress shows `8/8 ready` | [x] emulator |
| 6.2 | Confirm completion badge | **Seeker Ready** badge visible with subtitle (not web browser-wallet wording) | [x] emulator |
| 6.3 | Force-close and reopen app (wallet may be disconnected) | Completion badge still visible | [x] emulator |
| 6.4 | Confirm progress header | Still shows `8/8 ready` | [x] emulator |

---

## 7. Reset behavior

| # | Step | Expected | Pass |
|---|------|----------|------|
| 7.1 | Open **Settings** tab | Secondary screen; checklist not the focus | [ ] |
| 7.2 | Tap **Reset checklist progress** | Toast/feedback confirms reset | [ ] |
| 7.3 | Return to **Ready** tab | Progress reset (e.g. `0/8 ready` or partial if wallet reconnect auto-marks connect) | [ ] |
| 7.4 | Confirm badge removed | Completion badge no longer shown | [ ] |
| 7.5 | Confirm connect step cleared | **Connect wallet** step incomplete until connected again | [ ] |

---

## 8. Scope and regression checks

| # | Step | Expected | Pass |
|---|------|----------|------|
| 8.1 | Browse entire app | No token/address scanner UI | [ ] |
| 8.2 | Browse entire app | No Safety Lens / scam detector features | [ ] |
| 8.3 | Browse entire app | No SGT verification or reward/claim flows | [ ] |
| 8.4 | Settings only | Cluster and theme available; no demo wallet tools | [ ] |

---

## Sign-off

| Field | Value |
|-------|-------|
| Tester | Manual (emulator) |
| Device | Android Emulator — `SeekerReady_Pixel7_API34` |
| Android version | 14 (API 34) |
| Wallet app used | Mock MWA Wallet (`com.solana.mwallet`) |
| Build command | `npm run android` |
| Date | 2026-06-14 |
| Overall result | **Pass** (emulator `8/8`) |
| Notes | Full emulator checklist passed including Mock MWA connect/sign/verify. Real Seeker / Seed Vault QA pending. |

---

## Known limitations (not failures)

- Sign-message requires an **active wallet connection** at test time, even if connect step completion is persisted.
- MWA behavior can differ between Seeker, emulator, and third-party MWA wallets.
- Reset clears persisted progress; reconnecting may immediately re-complete connect wallet via MWA observation.
- **External resource links** open the system browser on Android. The emulator browser has no dedicated “back to app” button — use Android Back, Recents, or reopen Seeker Ready. Normal platform behavior; no app change required for MVP (see [EMULATOR_QA.md](./EMULATOR_QA.md)).
- **Mock MWA Wallet on emulator** requires screen lock + **Authenticate** in `mwallet` before connect/sign. Sign uses biometric approval; **do not automate** PIN/biometric taps (lockout risk). Resume steps: [EMULATOR_QA.md](./EMULATOR_QA.md#resume-manual-wallet-qa). Mock wallet is not production-equivalent to Seed Vault / Seeker hardware.
- **Web vs Android:** Browser wallet testing on web is documented in [NO_DEVICE_QA.md](./NO_DEVICE_QA.md) Section D. This manual pass remains the source of truth for **Android MWA** and Seeker / Seed Vault confidence.
- **MWA `sign_messages` return shape:** Wallets may return a raw 64-byte Ed25519 signature (not a Solana off-chain message envelope). Seeker Ready verifies both shapes locally. Pre-2026-06-14 builds only accepted envelopes and showed *Could not decode the signed message* with Mock MWA Wallet; fixed in `execute-wallet-sign-message.tsx` without bypassing verification. Emulator re-test **passed** 2026-06-14.
