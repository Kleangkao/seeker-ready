import type { Address } from '@solana/kit'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Platform, Text, View } from 'react-native'
import type { useMobileWallet } from '@wallet-ui/react-native-kit'

import { SAFE_SIGN_MESSAGE } from '@/features/readiness/data-access/readiness-types'
import { ReadinessUiPressable } from '@/features/readiness/ui/readiness-ui-pressable'
import { ShellUiStatusAlert } from '@/features/shell/ui/shell-ui-status-alert'
import {
  SURFACE_BUTTON,
  SURFACE_INNER,
  TEXT_ON_SURFACE_BODY,
  TEXT_ON_SURFACE_MUTED,
  TEXT_ON_SURFACE_TITLE,
} from '@/features/shell/ui/shell-ui-surface-styles'
import {
  executeAndVerifyWalletSignMessage,
  WalletSignMessageVerificationError,
} from '@/features/wallet/util/execute-wallet-sign-message'
import { formatError } from '@/features/wallet/util/format-error'

export function ReadinessUiSignMessageStep({
  complete,
  onSuccess,
  signMessages,
  walletAddress,
}: {
  complete: boolean
  onSuccess(): void
  signMessages: ReturnType<typeof useMobileWallet>['signMessages']
  walletAddress: Address
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [verificationFailed, setVerificationFailed] = useState(false)
  const { isPending, isSuccess, mutateAsync } = useMutation({
    mutationFn: () =>
      executeAndVerifyWalletSignMessage({
        expectedMessage: SAFE_SIGN_MESSAGE,
        signMessages,
        walletAddress,
      }),
    onSuccess: () => {
      setErrorMessage(null)
      setVerificationFailed(false)
      onSuccess()
    },
  })

  if (complete) {
    return (
      <Text className="text-sm font-medium text-green-300">
        Signature verified. This test did not move funds.
      </Text>
    )
  }

  return (
    <View className="gap-3">
      <View className={`p-3 ${SURFACE_INNER}`}>
        <Text className={`text-sm leading-5 ${TEXT_ON_SURFACE_BODY}`}>{SAFE_SIGN_MESSAGE}</Text>
      </View>
      <Text className={`text-sm ${TEXT_ON_SURFACE_MUTED}`}>
        This test only proves your wallet can sign a message. It does not spend tokens or move funds.
      </Text>
      {isSuccess ? (
        <ShellUiStatusAlert
          description="This test did not move funds."
          status="success"
          title="Signature verified"
        />
      ) : null}
      {errorMessage ? (
        <ShellUiStatusAlert
          description={errorMessage}
          status="danger"
          title={verificationFailed ? 'Signature verification failed' : 'Signature test failed'}
        />
      ) : null}
      <ReadinessUiPressable
        className={`items-center px-4 py-3 ${SURFACE_BUTTON}`}
        onPress={async () => {
          if (Platform.OS === 'web') {
            setErrorMessage('Sign-message testing requires the Android development build with an active wallet connection.')
            setVerificationFailed(false)
            return
          }

          try {
            setErrorMessage(null)
            setVerificationFailed(false)
            await mutateAsync()
          } catch (error) {
            setVerificationFailed(error instanceof WalletSignMessageVerificationError)
            setErrorMessage(formatError(error))
          }
        }}
      >
        <Text className={`text-sm font-semibold ${TEXT_ON_SURFACE_TITLE}`}>
          {isPending ? 'Waiting for wallet...' : 'Sign test message'}
        </Text>
      </ReadinessUiPressable>
    </View>
  )
}
