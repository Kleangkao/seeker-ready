# Seeker Ready — No-Device QA Checklist

Use this pass when you **do not have a physical Android device** or when you want to verify **web browser wallet** behavior before real Seeker / MWA device testing.

It separates what you can verify on web from what still requires Android + Mobile Wallet Adapter for final confidence.

> **Important:** Web browser wallet testing (Phantom / Solflare) does **not** replace [MANUAL_QA.md](./MANUAL_QA.md). Real Seeker, Seed Vault, and production MWA validation still require Android + a compatible MWA wallet.

---

## Section A — Web / static review

Run these without a phone. Web uses `localStorage` for checklist persistence (not MMKV). Android uses MMKV.

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
| A.7 | Progress header | "Seeker Ready" title + unified `x/8 ready` progress bar | [ ] |
| A.8 | Checklist cards | Connect, sign, concepts, resources, safety habits render | [ ] |
| A.9 | Concept cards | Short copy; "Got it" buttons present | [ ] |
| A.10 | Safety habits | All **6** items can be toggled | [ ] |
| A.11 | Settings tab | Opens secondary settings screen | [ ] |
| A.12 | Reset control | "Reset checklist progress" button present | [ ] |
| A.13 | Trusted links | Resource rows visible (opening works in browser) | [ ] |
| A.14 | Wallet section copy | States browser wallet on web; MWA / Seeker needs Android app | [ ] |
| A.15 | Connect entry point | Single **Connect wallet** button (not inline multi-wallet clutter) | [ ] |

### Static code review (no runtime device)

| # | Check | Where to look | Pass |
|---|-------|---------------|------|
| A.16 | Sign message text exact | `SAFE_SIGN_MESSAGE` in `readiness-types.ts` | [ ] |
| A.17 | Connect completion persisted | `connectWallet` in `readiness-store.ts` | [ ] |
| A.18 | Completion not tied to live account only | `use-readiness.ts` uses `progress.connectWallet` | [ ] |
| A.19 | Reset clears connect step | `resetReadinessProgress()` resets full default progress | [ ] |
| A.20 | Reset feedback | Toast in `settings-feature-entry.tsx` | [ ] |
| A.21 | Dead demo routes removed | No `src/app/tools/`, no `(wallet)/` routes | [ ] |
| A.22 | No scanner / Safety Lens / SGT verification in readiness flow | `src/features/readiness/` only | [ ] |
| A.23 | Web completion copy honest | `readiness-ui-completion-badge.tsx` — web ≠ Seeker Ready / MWA | [ ] |

---

## Section B — Android Emulator (optional)

Possible with Android Studio + AVD. **Non-wallet checks passed** on 2026-06-13; **full Mock MWA `8/8` passed** 2026-06-14 — see [EMULATOR_QA.md](./EMULATOR_QA.md).

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

**With Mock MWA Wallet installed** (`com.solana.mwallet`), emulator can also pass MWA connect, sign-message, and full `8/8` — see [MANUAL_QA.md](./MANUAL_QA.md) and [EMULATOR_QA.md](./EMULATOR_QA.md). Mock MWA is **not** production-equivalent to Seeker / Seed Vault.

| # | Check | Expected | Pass |
|---|-------|----------|------|
| B.8 | MWA connect | Wallet picker appears | [x] emulator (Mock MWA) |
| B.9 | Sign message | Wallet signing prompt appears | [x] emulator (Mock MWA) |
| B.10 | Full 8/8 completion | **Seeker Ready** badge after wallet steps | [x] emulator (Mock MWA) |

---

## Section C — Requires real Android / Seeker / production MWA

These **cannot** be fully verified on web or reliably substituted by browser wallets. Use [MANUAL_QA.md](./MANUAL_QA.md) on a real device.

| # | Check | Why web / emulator is not enough |
|---|-------|----------------------------------|
| C.1 | Production Mobile Wallet Adapter connect | Needs native MWA + real wallet app (e.g. Seed Vault) |
| C.2 | Seeker / Seed Vault signing UX | Browser wallets use extension prompts, not MWA |
| C.3 | Seeker hardware-backed key behavior | Not available in Phantom / Solflare web extensions |
| C.4 | MWA error / cancel handling on device | Best verified with real wallet prompts |
| C.5 | Workshop confidence on Seeker | Requires physical Seeker or trusted MWA environment |
| C.6 | **Seeker Ready** completion badge on device | Distinct from web **Browser wallet readiness complete** |

**Web can still verify:** layout, learning steps, safety copy, trusted links, local progress, browser wallet connect/sign, and honest product copy that browser mode ≠ Android MWA.

---

## Section D — Web browser wallet QA

Run in a desktop browser with Phantom and/or Solflare extensions. This tests **browser wallet readiness**, not Android MWA or Seed Vault.

**Prerequisites**

- `npm run web` (or deployed web build)
- Phantom extension and/or Solflare extension (or test with neither installed for install-link behavior)
- Use a test wallet with no funds required — sign-message only; no transactions

| # | Check | Expected | Pass |
|---|-------|----------|------|
| D.1 | **Connect wallet** opens modal | Modal shows Phantom and Solflare rows with logos | [ ] |
| D.2 | Phantom connect | Approve in Phantom → `Connected via Phantom: xxxx...xxxx` | [ ] |
| D.3 | Phantom sign message | Fixed test message; signature verified; step complete | [ ] |
| D.4 | Phantom disconnect | **Disconnect** clears live status; connect step stays complete if already achieved | [ ] |
| D.5 | Phantom reconnect | **Connect wallet** → Phantom → session restores or re-approves cleanly | [ ] |
| D.6 | Solflare connect | Approve in Solflare → `Connected via Solflare: xxxx...xxxx` | [ ] |
| D.7 | Solflare sign message | Signature verified; step complete | [ ] |
| D.8 | Both extensions installed | Modal shows **both** wallets; choice is clear (separate Connect buttons) | [ ] |
| D.9 | No wallet installed | **Install** links shown for missing extensions; app does not crash | [ ] |
| D.10 | Reject connect | Friendly toast (e.g. connection canceled) | [ ] |
| D.11 | Reject sign message | Friendly error (e.g. signing request dismissed) | [ ] |
| D.12 | Refresh / sessionStorage | After Phantom or Solflare connect, reload page → trusted reconnect or clean disconnected state (no broken stale UI) | [ ] |
| D.13 | Full `8/8` on web | All checklist steps complete | [ ] |
| D.14 | Web completion badge | **Browser wallet readiness complete** — not **Seeker Ready** | [ ] |
| D.15 | Product copy honest | Wallet section and completion text state browser wallet ≠ Android MWA / Seeker device testing | [ ] |
| D.16 | No transactions | Only sign-message test; no SOL spent | [ ] |

**Install link URLs (official):**

- Phantom: `https://phantom.app/`
- Solflare: `https://solflare.com/`

---

## Sign-off (no-device pass)

| Field | Value |
|-------|-------|
| Tester | |
| Date | |
| Web smoke test URL | |
| `tsc` | Pass / Fail |
| `lint:check` | Pass / Fail |
| Section A passed | /23 |
| Section D (web wallet) passed | /16 |
| Section B attempted | Yes / No |
| Section C deferred to MANUAL_QA | Yes |
| Notes | |

---

## What this pass is good for

- UI structure, navigation, and honest product copy
- Scope regression (no demo / scanner / SGT / reward surfaces)
- TypeScript / lint health
- Local checklist persistence on web (`localStorage`)
- **Browser wallet connect and safe sign-message** with Phantom or Solflare
- Full `8/8` **browser wallet readiness** on web
- Preparing for real Android / Seeker / MWA device QA

## What this pass is NOT good for

- Proving production Mobile Wallet Adapter integration on Seeker
- Proving Seed Vault or hardware-backed key behavior
- Substituting for real Seeker / Seed Vault device validation
- Production security certification
- Final Solana Mobile submission confidence

---

## Latest automated pass results

| Area | Result |
|------|--------|
| `tsc --noEmit` | Pass |
| `npm run lint:check` | Pass |
| Web loads locally | Pass (port may vary) |
| Ready tab first | Pass |
| Only Ready + Settings tabs | Pass |
| Unified `x/8` progress header | Pass |
| Browser wallet modal entry point | Pass (code) |
| Section D web wallet checklist | **Manual sign-off pending** |
| Real Seeker / Seed Vault MWA | Deferred to [MANUAL_QA.md](./MANUAL_QA.md) |
