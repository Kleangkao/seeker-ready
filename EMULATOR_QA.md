# Seeker Ready — Android Emulator QA

Non-wallet QA pass on **Android Studio Emulator**. Wallet steps remain blocked until a Mock MWA Wallet or other MWA-compatible wallet is installed on the emulator.

> **Full device + MWA pass:** Use [MANUAL_QA.md](./MANUAL_QA.md) after installing a compatible wallet.
>
> **Web / no-device pass:** See [NO_DEVICE_QA.md](./NO_DEVICE_QA.md).

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

### Temporary build workaround

Gradle **9.3.1** + React Native requires a one-line patch in `node_modules`:

`node_modules/@react-native/gradle-plugin/settings.gradle.kts` — `foojay-resolver-convention` **0.5.0 → 1.0.0**

This is **not** product code. It is lost on `npm install` unless persisted with `patch-package` later.

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

## Wallet QA — **BLOCKED**

Requires Mock MWA Wallet ([solana-mobile/mock-mwa-wallet](https://github.com/solana-mobile/mock-mwa-wallet)) or a real MWA-compatible wallet on the emulator/device.

| # | Check | Status |
|---|-------|--------|
| W.1 | Connect wallet (MWA picker + authorization) | **Blocked** |
| W.2 | Safe sign-message (wallet prompt + local verify) | **Blocked** |
| W.3 | Full `8/8` completion badge (includes wallet steps) | **Blocked** |
| W.4 | Connect step persistence after real MWA session | **Blocked** |
| W.5 | Sign step persistence after real signature | **Blocked** |

Do **not** fake these steps in the app. Install a wallet app on the emulator, then run [MANUAL_QA.md](./MANUAL_QA.md) sections 2–4 and 6.

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
| Date | 2026-06-13 |
| AVD | SeekerReady_Pixel7_API34 |
| Non-wallet emulator QA | **Pass** |
| Wallet / MWA QA | **Blocked** |
| Notes | External browser has no app back button; use system navigation |
