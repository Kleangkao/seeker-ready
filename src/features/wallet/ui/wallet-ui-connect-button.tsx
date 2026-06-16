import { useToast } from 'heroui-native/toast'
import { cn } from 'heroui-native/utils'
import { Platform, Text } from 'react-native'
import type { PropsWithChildren } from 'react'

import { ReadinessUiPressable } from '@/features/readiness/ui/readiness-ui-pressable'
import { useTheme } from '@/features/shell/data-access/use-theme'
import { formatError } from '@/features/wallet/util/format-error'

const WALLET_CONNECT_TOAST_ID = 'wallet-connect-error'

function getErrorCode(error: unknown) {
  if (error !== null && typeof error === 'object' && 'code' in error) {
    return String(error.code)
  }

  return ''
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
  const code = getErrorCode(error)
  const message = getErrorMessage(error)

  return (
    code === 'ERROR_ASSOCIATION_CANCELLED' ||
    code === 'Session not established: Local association cancelled by user' ||
    message.includes('CancellationException') ||
    message.includes('Local association cancelled by user')
  )
}

export function WalletUiConnectButton({
  children = 'Connect wallet',
  connect,
  size,
}: PropsWithChildren<{ connect: () => Promise<unknown>; size?: 'sm' | 'md' | 'lg' }>) {
  const { toast } = useToast()
  const { tintColor } = useTheme()
  const isSmall = size === 'sm'

  async function handleConnect() {
    if (Platform.OS === 'web') {
      toast.show({
        description: 'Wallet connection requires the Android development build with Mobile Wallet Adapter.',
        id: WALLET_CONNECT_TOAST_ID,
        label: 'Not available on web',
        placement: 'bottom',
        variant: 'warning',
      })
      return
    }

    try {
      toast.hide(WALLET_CONNECT_TOAST_ID)
      await connect()
    } catch (error) {
      const isCanceled = isWalletConnectionCanceled(error)

      toast.show({
        actionLabel: 'Try again',
        description: isCanceled
          ? 'The wallet connection request was dismissed before authorization completed.'
          : formatError(error),
        duration: 'persistent',
        id: WALLET_CONNECT_TOAST_ID,
        label: isCanceled ? 'Wallet connection canceled' : 'Could not connect wallet',
        onActionPress: ({ hide }) => {
          hide(WALLET_CONNECT_TOAST_ID)
          void handleConnect()
        },
        placement: 'bottom',
        variant: isCanceled ? 'warning' : 'danger',
      })
    }
  }

  return (
    <ReadinessUiPressable
      accessibilityRole="button"
      className={cn(
        'items-center rounded-xl px-4 active:opacity-80',
        isSmall ? 'py-2' : 'py-3',
      )}
      style={{ backgroundColor: tintColor }}
      onPress={() => void handleConnect()}
    >
      <Text className={cn('font-semibold text-white', isSmall ? 'text-sm' : 'text-base')}>
        {children}
      </Text>
    </ReadinessUiPressable>
  )
}
