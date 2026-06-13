# Seeker Ready — Android Emulator QA

Non-wallet QA **passed** on **Android Studio Emulator**. **Full emulator QA passed** on `SeekerReady_Pixel7_API34` (2026-06-14): Mock MWA connect, safe sign-message, local signature verification, concept cards, trusted resources, safety self-check, **`8/8` completion badge**, and persistence after restart all **passed**. Real Seeker / Seed Vault QA remains **pending**.

> **Full device + MWA pass:** Use [MANUAL_QA.md](./MANUAL_QA.md) after wallet steps are complete on emulator or hardware.
>
> **Web / no-device pass:** See [NO_DEVICE_QA.md](./NO_DEVICE_QA.md).

---

## Current status (pause-safe snapshot)

| Area | Status |
|------|--------|
| **Full emulator QA (`8/8`)** | **Pass** (2026-06-14) |
| Mock MWA Wallet installed | **Yes** — `com.solana.mwallet` on `SeekerReady_Pixel7_API34` |
| MWA connect | **Pass** |
| Shortened address | **Pass** — e.g. `Connected: 3PMU...FLzP` |
| Safe sign-message | **Pass** |
| Local signature verification | **Pass** — UI: *Signature verified. This test did not move funds.* |
| Concept cards | **Pass** |
| Trusted resource step | **Pass** |
| Safety self-check | **Pass** |
| Full `8/8` completion badge | **Pass** |
| Persistence after restart | **Pass** — all completion state retained after force-close/reopen |
| Real Seeker / Seed Vault QA | **Pending** — Mock MWA is not production-equivalent |

See [Sign-message verification fix](#sign-message-verification-fix-2026-06-14) for root cause and fix summary.

---

## Sign-message verification fix (2026-06-14)

### Previous failure (manual test)

After approving **Test safe signature** in Mock MWA Wallet, Seeker Ready returned to the app but showed:

- **Signature verification failed**
- **Could not decode the signed message returned by the wallet.**

Connect wallet and the wallet sign prompt both worked; only **local verification** failed.

### Root cause

**Format mismatch** between what Seeker Ready expected and what MWA `sign_messages` commonly returns:

| Layer | Expected by app (before fix) | Returned by Mock MWA / MWA `sign_messages` |
|-------|------------------------------|--------------------------------------------|
| Payload shape | Solana **off-chain message envelope** bytes (`getOffchainMessageEnvelopeDecoder`) | **Raw 64-byte Ed25519 signature** over the UTF-8 message bytes passed to `signMessages` |
| Signing input | Envelope preamble + structured off-chain message | Plain `TextEncoder` bytes of the test string |

Mock MWA Wallet (`MobileWalletAdapterViewModel.kt`) calls `SolanaSigningUseCase.signMessage(payload, keypair).**signature**` — the 64-byte signature only, not `signedPayload` (message + signature) and not a Kit off-chain envelope.

This is an MWA signed-payload shape issue, not a missing wallet connection or wrong test message.

### Fix summary

Updated `src/features/wallet/util/execute-wallet-sign-message.tsx`:

1. **Try off-chain envelope first** — keeps compatibility with wallets that return a full Solana off-chain message envelope.
2. **Fallback: raw MWA signed payload** — if envelope decode fails, verify:
   - **64 bytes** → raw Ed25519 signature over the expected UTF-8 message bytes, or
   - **message length + 64 bytes** → `message || signature` concatenation (common `signedPayload` shape).
3. **Local verification only** — uses `@solana/kit` `getPublicKeyFromAddress` + `verifySignature` against the connected address. No bypass, no mock-wallet name special-case.
4. **`__DEV__` diagnostics** — logs payload kind, byte lengths, and connected address (no secrets).

### Post-fix emulator status

| Check | Result | Notes |
|-------|--------|-------|
| Updated build installed (`npx expo run:android --no-bundler`) | **Pass** | 2026-06-14 |
| MWA connect on emulator | **Pass** | Mock MWA Wallet `com.solana.mwallet` |
| Safe sign-message prompt + approval | **Pass** | Exact test message shown and approved in mock wallet |
| Local signature verification | **Pass** | No decode error; verified against connected public key |
| Safe signature step completion | **Pass** | UI: *Signature verified. This test did not move funds.* |
| Concept cards | **Pass** | MWA, Seed Vault, dApp Store, Seeker ID marked read |
| Trusted resource step | **Pass** | Official link opened in emulator browser |
| Safety self-check | **Pass** | All five safety habit items completed |
| Full `8/8` completion badge | **Pass** | Progress header `8/8 ready`; completion badge visible |
| Persistence after restart | **Pass** | Force-close/reopen: full `8/8` state and badge retained |

**Full manual pass (2026-06-14):** Wallet connect → safe sign → concept cards → trusted resource → safety habits → `8/8 ready` → force-close/reopen → persistence confirmed. **Passed.**

---

## Build & tooling (verified path)

| Item | Value |
|------|-------|
| Emulator | Android Studio Emulator |
| AVD name | `SeekerReady_Pixel7_API34` |
| Device profile | Pixel 7 |
| System image | Android 14 (API 34), Google APIs, x86_64 |
| App package | `com.seekerready.app` |
| Dev server | `npm run dev` (Metro on `http://localhost:8081`) |
| Install command | `npm run android` (or `npx expo run:android --no-bundler` when Metro is already running) |
| `adb devices` | `emulator-5554 device` |

### Environment notes

- `ANDROID_HOME` / `ANDROID_SDK_ROOT`: `%LOCALAPPDATA%\Android\Sdk`
- `JAVA_HOME`: `C:\Program Files\Android\Android Studio\jbr`
- `GRADLE_USER_HOME`: `F:\gradle` (moved from C: after low disk space caused Metro `ENOSPC`)

### Temporary build workaround (Seeker Ready only)

Gradle **9.3.1** + React Native **0.85** can fail with:

`JvmVendorSpec IBM_SEMERU does not have member field`

**Known local workaround** (not committed; **do not** use `patch-package` yet):

Edit `node_modules/@react-native/gradle-plugin/settings.gradle.kts`:

```diff
- plugins { id("org.gradle.toolchains.foojay-resolver-convention").version("0.5.0") }
+ plugins { id("org.gradle.toolchains.foojay-resolver-convention").version("1.0.0") }
```

- This is **not** Seeker Ready product code.
- Lost on `npm install` — re-apply manually if Android build fails after reinstall.
- Mock MWA Wallet uses Gradle **8.13** and does **not** need this patch.

### Restart commands (this PC)

**Environment (PowerShell, each session):**

```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
$env:GRADLE_USER_HOME = "F:\gradle"
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\cmdline-tools\latest\bin;" + $env:Path
```

**Start emulator:**

```powershell
& "$env:ANDROID_HOME\emulator\emulator.exe" -avd SeekerReady_Pixel7_API34
```

Verify: `adb devices` → `emulator-5554 device`

**Start Metro (Terminal 1):**

```powershell
cd "f:\James\cursor-program\Seeker Ready"
npm run dev
```

**Run / reinstall Seeker Ready (Terminal 2, after emulator is up):**

```powershell
cd "f:\James\cursor-program\Seeker Ready"
npx expo run:android --no-bundler
```

Use full `npm run android` only if Metro is not already running.

**Open apps on emulator (optional):**

```powershell
adb -s emulator-5554 shell am start -n com.solana.mwallet/.MainActivity
adb -s emulator-5554 shell am start -n com.seekerready.app/.MainActivity
```

**Reinstall Mock MWA Wallet (if needed):**

```powershell
cd F:\James\mock-mwa-wallet
.\gradlew.bat :app:assembleDebug
adb -s emulator-5554 install -r app\build\outputs\apk\debug\app-debug.apk
```

---

## Non-wallet QA — **PASSED** (2026-06-13)

| # | Check | Result |
|---|-------|--------|
| E.1 | Ready tab opens; app runs on emulator | **Pass** |
| E.2 | Concept cards: **Mark as read** works; progress increases | **Pass** |
| E.3 | Trusted resource links open in emulator browser | **Pass** |
| E.4 | Safety self-check rows toggle; progress increases | **Pass** |
| E.5 | Progress persists after close/reopen | **Pass** |
| E.6 | Settings reset clears progress to `0/8` | **Pass** |
| E.7 | No wallet demo / tools / scanner / Safety Lens UI | **Pass** |

### UX / testing note — external browser return

When a trusted resource link opens, the **emulator system browser** takes focus. There is no in-browser “back to Seeker Ready” button — return via Android **Back**, **Recents**, or **Home** and reopen the app.

This is **normal Android / emulator behavior** for `Linking.openURL` external intents. **No app-side change required** for MVP; document only. Optional future improvement (out of scope now): Chrome Custom Tabs for an inline back affordance.

---

## Wallet QA — Mock MWA Wallet — **PASSED** (2026-06-14)

Tested with official [Mock MWA Wallet](https://github.com/solana-mobile/mock-mwa-wallet) built from source and installed on `SeekerReady_Pixel7_API34`. Manual re-test after signature verification fix: **all wallet steps passed**.

**Not production-equivalent:** Mock MWA Wallet does not replicate Seed Vault / Seeker hardware. **Real Seeker / Seed Vault device QA remains pending.**

### Mock wallet setup (this PC)

| Item | Value |
|------|-------|
| Clone path | `F:\James\mock-mwa-wallet` (outside Seeker Ready repo) |
| Package | `com.solana.mwallet` |
| Display name | `mwallet` |
| APK | `F:\James\mock-mwa-wallet\app\build\outputs\apk\debug\app-debug.apk` |
| Build command | `.\gradlew.bat :app:assembleDebug` |
| Install command | `adb -s emulator-5554 install -r app\build\outputs\apk\debug\app-debug.apk` |
| SDK 36 install | **Not required** — build succeeded with existing SDK from Seeker Ready setup |
| Emulator PIN | Set via `adb shell locksettings set-pin 1234` |
| Pre-test step | Open **mwallet** → tap **Authenticate** (15-minute dev session) |

### Wallet flow results

| # | Check | Result | Notes |
|---|-------|--------|-------|
| W.1 | Connect wallet (MWA + `mwallet`) | **Pass** | MWA local association established; mock wallet **Connect** sheet approved |
| W.2 | Shortened address display | **Pass** | `Connected: 3PMU...FLzP` |
| W.3 | Connect step completion | **Pass** | Step marked complete after successful connection |
| W.4 | Safe sign-message | **Pass** | Mock wallet sheet showed exact text: `I am testing wallet signing in Seeker Ready. This does not move funds.` |
| W.5 | Local signature verification | **Pass** | Post-fix: raw 64-byte Ed25519 signature verified locally. UI: *Signature verified. This test did not move funds.* Pre-fix decode error resolved. |
| W.6 | Safe signature step completion | **Pass** | Step marked complete only after verification succeeded |
| W.7 | Persistence after restart | **Pass** | Force-close/reopen: full `8/8` state and badge retained |
| W.8 | Full `8/8` completion badge | **Pass** | All 8 checklist steps complete; badge visible |

### Emulator wallet testing notes

- **Biometric/PIN required:** Mock MWA Wallet uses `BiometricPrompt` for Approve actions. Prefer emulator **fingerprint** (`adb -s emulator-5554 emu finger touch 1`) over repeated PIN keyevents to avoid lockout.
- **Live connection for sign:** Sign UI requires an active `account` from MWA. If live status shows `Not connected right now`, tap **Connect Wallet** again before **Test safe signature**.
- **Mock MWA ≠ production:** Does not replicate Seed Vault / Seeker hardware behavior. **Real Seeker/device QA remains pending.**

## Resume manual wallet QA

Full emulator QA (**`8/8` + persistence**) **passed** on 2026-06-14. Use these steps only when re-running on a fresh emulator or after mock wallet reinstall.

When you return to the emulator UI — **manual interaction only**. Do **not** automate biometric/PIN approval.

### A. Prepare emulator

1. Start AVD `SeekerReady_Pixel7_API34` (see [Restart commands](#restart-commands-this-pc)).
2. If **mwallet** shows *Too many incorrect attempts*: wait for the timer **or** cold-boot the AVD (Device Manager → ⋮ → Cold Boot Now).
3. Keep screen lock enabled. **Do not** send repeated `adb` PIN keyevents.
4. Enroll fingerprint (if not done):
   - **Settings** → **Security & privacy** → **Device unlock** → **Fingerprint unlock**
   - Confirm PIN → add fingerprint
   - Emulator **Extended controls** (⋮) → **Fingerprint** → enroll **Fingerprint 1** if prompted

### B. Authenticate mock wallet

1. Open **mwallet** (`com.solana.mwallet`).
2. Tap **Authenticate**.
3. When the **biometric prompt is visible**, approve **once** (Extended controls → Touch sensor, or `adb -s emulator-5554 emu finger touch 1` **only at this moment**).
4. Confirm toast: **Authentication succeeded!**

### C. Seeker Ready — connect + sign

1. Start Metro if needed: `npm run dev`.
2. Open **Seeker Ready**.
3. If status is **Not connected right now** → **Connect Wallet** → mock wallet **Connect** → biometric **once**.
4. Confirm shortened address: `Connected: xxxx...xxxx`.
5. Tap **Test safe signature**.
6. Confirm exact message: `I am testing wallet signing in Seeker Ready. This does not move funds.`
7. Mock wallet → **Approve** → biometric **once**.
8. Confirm in Seeker Ready: **Signature verified** / *This test did not move funds.*

### D. Complete 8/8 + persistence

1. Finish concept cards (**Mark as read**), one trusted resource, all safety habits.
2. Confirm **8/8 ready** and completion badge.
3. Force-close Seeker Ready → reopen → confirm wallet + learning progress persists as expected.

### E. Record results

Update this file and [MANUAL_QA.md](./MANUAL_QA.md) with pass/fail. Then run [MANUAL_QA.md](./MANUAL_QA.md) sections 2–4 and 6. Do **not** fake connect, sign, or `8/8` in the app.

---

## Automated checks (latest)

```bash
npx tsc --noEmit
npm run lint:check
```

| Check | Result |
|-------|--------|
| `tsc --noEmit` | Pass |
| `npm run lint:check` | Pass (harmless `bun` warning from Expo lint) |

---

## Sign-off

| Field | Value |
|-------|-------|
| Tester | Manual (emulator) |
| Date | 2026-06-14 |
| AVD | SeekerReady_Pixel7_API34 |
| Non-wallet emulator QA | **Pass** |
| Full emulator QA (`8/8` + Mock MWA) | **Pass** — connect, sign, verify, learning steps, badge, persistence |
| Real Seeker / Seed Vault device QA | **Pending** |
| Notes | Pre-fix sign failure: MWA returned raw 64-byte Ed25519 signature; app expected off-chain envelope. Fixed in `execute-wallet-sign-message.tsx` without bypassing verification. Mock MWA is not production-equivalent. External browser has no app back button; use system navigation. Mock wallet clone at `F:\James\mock-mwa-wallet`. |
