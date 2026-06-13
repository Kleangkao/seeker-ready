# Seeker Ready — No-Device QA Checklist

Use this pass when you **do not have a physical Android device** or MWA-compatible wallet available.

It separates what you can verify now from what must wait for real device testing.

> **Important:** This pass does **not** replace [MANUAL_QA.md](./MANUAL_QA.md). MWA connect, sign-message, and Seeker-like wallet behavior require Android + a compatible wallet environment.

---

## Section A — Can verify on Web / static review

Run these without a phone. Web preview covers UI; static review covers code and persistence wiring.

### Automated checks

```bash
npm install --legacy-peer-deps
npx tsc --noEmit
npm run lint:check
```

| # | Check | How | Pass |
|---|-------|-----|------|
| A.1 | TypeScript compiles | `npx tsc --noEmit` | [ ] |
| A.2 | Lint passes | `npm run lint:check` | [ ] |
| A.3 | Dependencies install | `npm install --legacy-peer-deps` | [ ] |

### Web UI smoke test

Web preview is for **UI/navigation only**. It uses `localStorage` instead of MMKV and cannot test MWA.

```bash
npm install --legacy-peer-deps
npm run web
```

Open the local URL shown in the terminal (usually `http://localhost:8081`).

If you see a Reanimated/Worklets version error, ensure `react-native-worklets` is `0.9.x` to match `react-native-reanimated` 4.4.x.

| # | Check | Expected | Pass |
|---|-------|----------|------|
| A.4 | First screen | **Ready** tab / checklist is the main view | [ ] |
| A.5 | Tab bar | Only **Ready** and **Settings** visible | [ ] |
| A.6 | No demo surfaces | No Wallet demo, Tools, Activity, balance, scanner, Safety Lens UI | [ ] |
| A.7 | Progress header | "Seeker Ready" title + `x/8 ready` progress bar | [ ] |
| A.8 | Checklist cards | Connect, sign, concepts, resources, safety habits render | [ ] |
| A.9 | Concept cards | Short copy; "Got it" buttons present | [ ] |
| A.10 | Safety habits | All 5 items can be toggled | [ ] |
| A.11 | Settings tab | Opens secondary settings screen | [ ] |
| A.12 | Reset control | "Reset checklist progress" button present | [ ] |
| A.13 | Trusted links | Resource rows visible (opening may work in browser) | [ ] |

### Static code review (no runtime device)

| # | Check | Where to look | Pass |
|---|-------|---------------|------|
| A.14 | Sign message text exact | `SAFE_SIGN_MESSAGE` in `readiness-types.ts` | [ ] |
| A.15 | Connect completion persisted | `connectWallet` in MMKV `readiness-store.ts` | [ ] |
| A.16 | Completion not tied to live account only | `use-readiness.ts` uses `progress.connectWallet` | [ ] |
| A.17 | Reset clears connect step | `resetReadinessProgress()` resets full default progress | [ ] |
| A.18 | Reset feedback | Toast in `settings-feature-entry.tsx` | [ ] |
| A.19 | Dead demo routes removed | No `src/app/tools/`, no `(wallet)/` routes | [ ] |
| A.20 | No scanner / Safety Lens / SGT code in readiness flow | `src/features/readiness/` only | [ ] |

---

## Section B — Can verify on Android Emulator

Possible with Android Studio + AVD. **Non-wallet checks passed** on 2026-06-13 — full detail in [EMULATOR_QA.md](./EMULATOR_QA.md).

### Setup

1. Install [Android Studio](https://developer.android.com/studio)
2. AVD: `SeekerReady_Pixel7_API34` (Pixel 7, API 34, Google APIs, x86_64)
3. Start emulator, then:

```bash
npm run dev
npm run android
```

| # | Check | Expected | Pass |
|---|-------|----------|------|
| B.1 | Dev build installs | Seeker Ready opens on emulator | [x] |
| B.2 | Ready tab first | Checklist home, not wallet demo | [x] |
| B.3 | Tabs | Ready + Settings only | [x] |
| B.4 | UI layout | Mobile layout readable; scroll works | [x] |
| B.5 | Local persistence | Concept / safety / resource progress survives reload | [x] |
| B.6 | Reset | Clears progress + shows toast | [x] |
| B.7 | External links | Opens emulator browser (use system Back/Recents to return) | [x] |

**Emulator caveat:** MWA connect/sign unavailable without a wallet app on the emulator. B.8+ remain **blocked**.

| # | Check | Expected | Pass |
|---|-------|----------|------|
| B.8 | MWA connect | Wallet picker appears | Blocked |
| B.9 | Sign message | Wallet signing prompt appears | Blocked |
| B.10 | Full 8/8 completion | Badge after wallet steps | Blocked |

---

## Section C — Requires real Android / Seeker / MWA-compatible wallet

These **cannot** be fully verified on Web or reliably on emulator. Use [MANUAL_QA.md](./MANUAL_QA.md) on a real device.

| # | Check | Why blocked without device |
|---|-------|---------------------------|
| C.1 | Mobile Wallet Adapter connect | Needs native MWA + wallet app |
| C.2 | Sign message flow | Needs wallet authorization UI |
| C.3 | Shortened wallet address display | Needs live `account` from MWA |
| C.4 | Connect step observed + persisted after real connection | Needs successful MWA session at least once |
| C.5 | Full completion badge with wallet steps | Sign step requires live wallet |
| C.6 | Seed Vault / Seeker-like behavior | Seeker hardware or compatible MWA wallet |
| C.7 | Post-reload badge with wallet disconnected | Best verified after real MWA testing |
| C.8 | Production-like MWA error/cancel handling | Needs real wallet prompts |

---

## Sign-off (no-device pass)

| Field | Value |
|-------|-------|
| Tester | |
| Date | |
| Web smoke test URL | |
| `tsc` | Pass / Fail |
| `lint:check` | Pass / Fail |
| Section A passed | /20 |
| Section B attempted | Yes / No |
| Section C deferred | Yes |
| Notes | |

---

## What this pass is good for

- UI structure and copy review
- Navigation and scope regression (no demo/scanner surfaces)
- TypeScript / lint health
- Local checklist persistence (concepts, safety, resources) on Web where MMKV works
- Preparing for real device QA

## What this pass is NOT good for

- Proving MWA integration works
- Proving sign-message is safe and successful end-to-end
- Seeker / Seed Vault-specific behavior
- Final Solana Mobile submission confidence

---

## Web QA rules (no Android device)

Treat these as **blocked / N/A on web**, not failures:

- Connect Wallet (MWA)
- Safe sign-message
- Wallet address display
- Full 8/8 completion that requires wallet steps

Web uses `localStorage` for checklist persistence (not MMKV). Android uses MMKV.

---

## Latest no-device pass results (automated + structural)

| Area | Result |
|------|--------|
| `tsc --noEmit` | Pass |
| `npm run lint:check` | Pass |
| Web loads at `http://localhost:8082` | Pass |
| Ready tab first | Pass |
| Only Ready + Settings tabs | Pass |
| Checklist UI renders | Pass |
| Concept cards + Got it buttons present | Pass |
| Resource links show Open affordance | Pass |
| Safety habits show checkbox rows | Pass (after UX polish) |
| Settings screen at `/settings` | Pass |
| Reset control present | Pass |
| No Wallet demo / Tools / scanner UI | Pass |
| MWA connect / sign-message | Blocked (Android + MWA) |
| Interaction persistence (reload) | Manual click verify in browser recommended |
