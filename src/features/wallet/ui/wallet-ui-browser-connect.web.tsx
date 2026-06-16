import Ionicons from '@expo/vector-icons/Ionicons'
import { useToast } from 'heroui-native/toast'
import { cn } from 'heroui-native/utils'
import * as Linking from 'expo-linking'
import { Image, Modal, Text, View } from 'react-native'
import { useMemo, useState } from 'react'

import { ReadinessUiPressable } from '@/features/readiness/ui/readiness-ui-pressable'
import { useTheme } from '@/features/shell/data-access/use-theme'
import {
  SURFACE_BUTTON,
  SURFACE_CARD,
  TEXT_ON_SURFACE_BODY,
  TEXT_ON_SURFACE_MUTED,
  TEXT_ON_SURFACE_TITLE,
} from '@/features/shell/ui/shell-ui-surface-styles'
import {
  BrowserWalletUnavailableError,
  getBrowserWalletCatalog,
  type BrowserWalletId,
} from '@/features/wallet/data-access/web-wallet-browser'
import type { WalletUiBrowserConnectProps } from '@/features/wallet/ui/wallet-ui-browser-connect.types'
import { formatError } from '@/features/wallet/util/format-error'

const WALLET_CONNECT_TOAST_ID = 'wallet-connect-error'

const WALLET_LOGOS: Record<BrowserWalletId, string> = {
  phantom: 'https://phantom.app/img/phantom-icon-purple.png',
  solflare: 'https://solflare.com/favicon-32x32.png',
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  if (error !== null && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }

  return typeof error === 'string' ? error : ''
}

function isWalletConnectionCanceled(error: unknown) {
  const message = getErrorMessage(error)

  return (
    message.includes('User rejected') ||
    message.includes('rejected the request') ||
    message.includes('Connection rejected')
  )
}

function WalletUiBrowserConnectPicker({
  connect,
  onClose,
  visible,
}: WalletUiBrowserConnectProps & { onClose(): void; visible: boolean }) {
  const { toast } = useToast()
  const walletOptions = useMemo(() => getBrowserWalletCatalog(), [])

  async function handleConnect(walletId: BrowserWalletId, walletLabel: string) {
    try {
      toast.hide(WALLET_CONNECT_TOAST_ID)
      await connect(walletId)
      onClose()
    } catch (error) {
      const isCanceled = isWalletConnectionCanceled(error)
      const isUnavailable = error instanceof BrowserWalletUnavailableError

      toast.show({
        actionLabel: isUnavailable ? undefined : 'Try again',
        description: isCanceled
          ? 'The wallet connection request was dismissed before authorization completed.'
          : formatError(error),
        duration: 'persistent',
        id: WALLET_CONNECT_TOAST_ID,
        label: isCanceled
          ? 'Wallet connection canceled'
          : isUnavailable
            ? `${walletLabel} not available`
            : 'Could not connect wallet',
        onActionPress: isUnavailable
          ? undefined
          : ({ hide }) => {
              hide(WALLET_CONNECT_TOAST_ID)
              void handleConnect(walletId, walletLabel)
            },
        placement: 'bottom',
        variant: isCanceled ? 'warning' : 'danger',
      })
    }
  }

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/65 px-5">
        <ReadinessUiPressable
          accessibilityLabel="Close wallet picker"
          className="absolute inset-0"
          onPress={onClose}
        />
        <View className={cn('w-full max-w-md gap-4 rounded-2xl p-5', SURFACE_CARD)}>
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-1">
              <Text className={`text-lg font-semibold ${TEXT_ON_SURFACE_TITLE}`}>
                Connect a wallet
              </Text>
              <Text className={`text-sm leading-5 ${TEXT_ON_SURFACE_MUTED}`}>
                Choose a browser wallet to continue.
              </Text>
            </View>
            <ReadinessUiPressable
              accessibilityLabel="Close"
              accessibilityRole="button"
              className="rounded-full p-1 active:opacity-70"
              onPress={onClose}
            >
              <Ionicons color="#A3A3A3" name="close" size={22} />
            </ReadinessUiPressable>
          </View>

          <View className="gap-2">
            {walletOptions.map((wallet) => (
              <View
                key={wallet.id}
                className={cn(
                  'flex-row items-center gap-3 rounded-xl border border-white/10 bg-black/25 p-3',
                )}
              >
                <Image
                  accessibilityLabel={`${wallet.label} logo`}
                  className="h-10 w-10 rounded-xl"
                  source={{ uri: WALLET_LOGOS[wallet.id] }}
                />
                <View className="min-w-0 flex-1 gap-0.5">
                  <Text className={`text-base font-semibold ${TEXT_ON_SURFACE_TITLE}`}>
                    {wallet.label}
                  </Text>
                  <Text className={`text-xs ${TEXT_ON_SURFACE_MUTED}`}>
                    {wallet.isAvailable ? 'Detected in this browser' : 'Extension not detected'}
                  </Text>
                </View>
                {wallet.isAvailable ? (
                  <ReadinessUiPressable
                    accessibilityRole="button"
                    className="rounded-lg bg-white/12 px-3 py-2 active:opacity-80"
                    onPress={() => void handleConnect(wallet.id, wallet.label)}
                  >
                    <Text className={`text-sm font-semibold ${TEXT_ON_SURFACE_BODY}`}>Connect</Text>
                  </ReadinessUiPressable>
                ) : (
                  <ReadinessUiPressable
                    accessibilityRole="link"
                    className={cn('rounded-lg px-3 py-2', SURFACE_BUTTON)}
                    onPress={() => void Linking.openURL(wallet.installUrl)}
                  >
                    <Text className={`text-sm font-semibold ${TEXT_ON_SURFACE_TITLE}`}>Install</Text>
                  </ReadinessUiPressable>
                )}
              </View>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  )
}

export function WalletUiBrowserConnect({ connect }: WalletUiBrowserConnectProps) {
  const { tintColor } = useTheme()
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  return (
    <>
      <ReadinessUiPressable
        accessibilityRole="button"
        className={cn('items-center rounded-xl px-4 py-3 active:opacity-80')}
        style={{ backgroundColor: tintColor }}
        onPress={() => setIsPickerOpen(true)}
      >
        <Text className="text-base font-semibold text-white">Connect wallet</Text>
      </ReadinessUiPressable>
      <WalletUiBrowserConnectPicker
        connect={connect}
        visible={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
      />
    </>
  )
}
