# Seeker Ready — Manual QA Checklist

Use this checklist on an **Android custom Expo development build** with a **compatible Mobile Wallet Adapter (MWA) wallet** (for example Seed Vault on Seeker, or another MWA-capable wallet in your test environment).

**Do not use Expo Go** for this pass. MWA connect and sign-message require native wallet integration.

> **No Android device?** Start with [NO_DEVICE_QA.md](./NO_DEVICE_QA.md) for Web/static checks.
>
> **Android Emulator (non-wallet)?** See [EMULATOR_QA.md](./EMULATOR_QA.md) — learning steps, persistence, and reset **passed** on `SeekerReady_Pixel7_API34`.
>
> **Android Emulator (Mock MWA Wallet)?** Connect wallet **passed** with `com.solana.mwallet` on 2026-06-14. Sign prompt showed the correct message. Sign/local verification/`8/8` are **paused** for manual biometric approval — see [EMULATOR_QA.md — Resume manual wallet QA](./EMULATOR_QA.md#resume-manual-wallet-qa). Real Seeker/device QA remains **pending**.

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

| # | Step | Expected | Pass |
|---|------|----------|------|
| 2.1 | On Ready tab, find **Connect wallet** | Step card with connect action visible | [ ] |
| 2.2 | Tap **Connect Wallet** | MWA wallet picker / authorization flow opens | [ ] |
| 2.3 | Approve connection in wallet | App shows live status: `Connected: xxxx...xxxx` (shortened address) | [ ] |
| 2.4 | Check step completion | **Connect wallet** step shows complete (checkmark / Done) | [ ] |
| 2.5 | Disconnect wallet (optional) | Live status changes to `Not connected right now` | [ ] |
| 2.6 | Confirm step still complete after disconnect | Connect wallet step remains complete if already achieved once | [ ] |

---

## 3. Connect wallet persistence (reload)

| # | Step | Expected | Pass |
|---|------|----------|------|
| 3.1 | Complete **Connect wallet** at least once | Step marked complete | [ ] |
| 3.2 | Force-close the app completely | App is not running in background | [ ] |
| 3.3 | Reopen the app | Ready checklist loads | [ ] |
| 3.4 | Check connect step | **Connect wallet** step still complete even if MWA session not restored | [ ] |
| 3.5 | Check live status | Shows `Connected: ...` or `Not connected right now` accurately | [ ] |

---

## 4. Safe sign-message

| # | Step | Expected | Pass |
|---|------|----------|------|
| 4.1 | Reconnect wallet if needed | Live connection active | [ ] |
| 4.2 | Open **Test safe signature** step | Fixed message shown exactly: `I am testing wallet signing in Seeker Ready. This does not move funds.` | [ ] |
| 4.3 | Read helper copy | UI states signing does not spend tokens or move funds | [ ] |
| 4.4 | Tap **Test safe signature** | Wallet signing prompt appears | [ ] |
| 4.5 | Approve signature in wallet | Success feedback; step marked complete | [ ] |
| 4.6 | Reload app | **Test safe signature** step remains complete | [ ] |

---

## 5. Concept cards, resources, and safety habits

| # | Step | Expected | Pass |
|---|------|----------|------|
| 5.1 | Tap **Got it** on each concept card | MWA, Seed Vault, dApp Store, Seeker ID steps complete | [ ] |
| 5.2 | Tap any trusted resource link | External browser opens official URL | [ ] |
| 5.3 | Return to app | **Open trusted resources** step complete | [ ] |
| 5.4 | Check all 5 safety habit items | Each toggles on tap | [ ] |
| 5.5 | Complete all habits | **Complete basic safety habits** step shows complete | [ ] |
| 5.6 | Reload app | Concept, resource, and safety progress persists | [ ] |

---

## 6. Completion badge persistence

| # | Step | Expected | Pass |
|---|------|----------|------|
| 6.1 | Complete all 8 checklist steps | Progress shows `8/8 ready` | [ ] |
| 6.2 | Confirm completion badge | **Seeker Ready** badge visible with subtitle | [ ] |
| 6.3 | Force-close and reopen app (wallet may be disconnected) | Completion badge still visible | [ ] |
| 6.4 | Confirm progress header | Still shows `8/8 ready` | [ ] |

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
| Tester | |
| Device | |
| Android version | |
| Wallet app used | |
| Build command | `npm run android` |
| Date | |
| Overall result | Pass / Fail |
| Notes | |

---

## Known limitations (not failures)

- Sign-message requires an **active wallet connection** at test time, even if connect step completion is persisted.
- MWA behavior can differ between Seeker, emulator, and third-party MWA wallets.
- Reset clears persisted progress; reconnecting may immediately re-complete connect wallet via MWA observation.
- **External resource links** open the system browser on Android. The emulator browser has no dedicated “back to app” button — use Android Back, Recents, or reopen Seeker Ready. Normal platform behavior; no app change required for MVP (see [EMULATOR_QA.md](./EMULATOR_QA.md)).
- **Mock MWA Wallet on emulator** requires screen lock + **Authenticate** in `mwallet` before connect/sign. Sign uses biometric approval; **do not automate** PIN/biometric taps (lockout risk). Resume steps: [EMULATOR_QA.md](./EMULATOR_QA.md#resume-manual-wallet-qa). Mock wallet is not production-equivalent to Seed Vault / Seeker hardware.
