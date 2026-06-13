# Seeker Ready — Android Emulator QA

Non-wallet QA **passed** on **Android Studio Emulator**. Mock MWA Wallet is **installed**; connect **passed**; sign / local verification / `8/8` are **paused** pending manual biometric approval on the emulator UI.

> **Full device + MWA pass:** Use [MANUAL_QA.md](./MANUAL_QA.md) after wallet steps are complete on emulator or hardware.
>
> **Web / no-device pass:** See [NO_DEVICE_QA.md](./NO_DEVICE_QA.md).

---

## Current status (pause-safe snapshot)

| Area | Status |
|------|--------|
| Mock MWA Wallet installed | **Yes** — `com.solana.mwallet` on `SeekerReady_Pixel7_API34` |
| Connect wallet (emulator) | **Pass** |
| Shortened address | **Pass** — e.g. `Connected: 3PMU...FLzP` |
| Safe sign-message prompt | **Pass (prompt only)** — correct test message shown in mock wallet sheet |
| Sign / local verification | **Pending manual** — biometric approval not completed (prior automated `adb` taps caused lockout; not a Seeker Ready product bug) |
| Full `8/8` badge | **Pending manual** |
| Persistence after restart (wallet steps) | **Pending manual** |
| Real Seeker / Seed Vault QA | **Pending** — Mock MWA is not production-equivalent |

**Paused:** Do not automate biometric/PIN taps. Complete wallet sign + `8/8` manually when available (see [Resume manual wallet QA](#resume-manual-wallet-qa)).

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

## Wallet QA — Mock MWA Wallet (2026-06-14)

Tested with official [Mock MWA Wallet](https://github.com/solana-mobile/mock-mwa-wallet) built from source and installed on `SeekerReady_Pixel7_API34`.

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
| W.3 | Connect step completion | **Pass** | Progress advanced (e.g. `1/8 ready` / `3/8 ready` with partial learning steps) |
| W.4 | Safe sign-message prompt | **Partial** | Mock wallet sheet showed exact text: `I am testing wallet signing in Seeker Ready. This does not move funds.` |
| W.5 | Local signature verification | **Blocked (manual)** | Automated `adb` runs hit `CancellationException` / biometric lockout (`Too many incorrect attempts`) before verification completed |
| W.6 | Full `8/8` completion badge | **Blocked (manual)** | Requires successful sign step + remaining learning/self-check steps |
| W.7 | Persistence after reload | **Not re-verified** | Connect step persistence expected per app design; re-test manually after sign pass |

### Emulator wallet testing notes

- **Biometric/PIN required:** Mock MWA Wallet uses `BiometricPrompt` for Approve actions. Prefer emulator **fingerprint** (`adb -s emulator-5554 emu finger touch 1`) over repeated PIN keyevents to avoid lockout.
- **Live connection for sign:** Sign UI requires an active `account` from MWA. If live status shows `Not connected right now`, tap **Connect Wallet** again before **Test safe signature**.
- **Mock MWA ≠ production:** Does not replicate Seed Vault / Seeker hardware behavior. **Real Seeker/device QA remains pending.**

## Resume manual wallet QA

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
| Date | 2026-06-14 (paused — sign/8/8 manual pending) |
| AVD | SeekerReady_Pixel7_API34 |
| Non-wallet emulator QA | **Pass** |
| Mock MWA connect on emulator | **Pass** (2026-06-14) |
| Mock MWA sign + local verify + 8/8 | **Partial — manual follow-up** |
| Real Seeker / Seed Vault device QA | **Pending** |
| Notes | External browser has no app back button; use system navigation. Mock wallet clone at `F:\James\mock-mwa-wallet`. |
