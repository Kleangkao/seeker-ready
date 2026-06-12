import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { useEffect } from 'react'
import { Platform, Text, View } from 'react-native'

import { useReadiness } from '@/features/readiness/data-access/use-readiness'
import {
  READINESS_CONCEPTS,
  SAFETY_HABITS,
  TRUSTED_RESOURCES,
} from '@/features/readiness/data-access/readiness-types'
import { ellipsify } from '@/features/readiness/util/ellipsify'
import { ReadinessUiCompletionBadge } from '@/features/readiness/ui/readiness-ui-completion-badge'
import { ReadinessUiConceptCard } from '@/features/readiness/ui/readiness-ui-concept-card'
import { ReadinessUiPreviewBanner } from '@/features/readiness/ui/readiness-ui-preview-banner'
import { ReadinessUiPreviewProgressHeader } from '@/features/readiness/ui/readiness-ui-preview-progress-header'
import { ReadinessUiProgressHeader } from '@/features/readiness/ui/readiness-ui-progress-header'
import { ReadinessUiResourceLink } from '@/features/readiness/ui/readiness-ui-resource-link'
import { ReadinessUiSafetyChecklist } from '@/features/readiness/ui/readiness-ui-safety-checklist'
import { ReadinessUiSignMessageStep } from '@/features/readiness/ui/readiness-ui-sign-message-step'
import { ReadinessUiPressable } from '@/features/readiness/ui/readiness-ui-pressable'
import { ReadinessUiStepCard } from '@/features/readiness/ui/readiness-ui-step-card'
import { ShellUiPage } from '@/features/shell/ui/shell-ui-page'
import { WalletUiConnectButton } from '@/features/wallet/ui/wallet-ui-connect-button'

export function ReadinessFeatureHome() {
  const { account, connect, disconnect, signMessages } = useMobileWallet()
  const {
    completedCount,
    isAllComplete,
    isStepComplete,
    learningCompletedCount,
    learningTotalCount,
    markStepComplete,
    progress,
    toggleSafetyHabit,
    totalCount,
    walletTotalCount,
  } = useReadiness()
  const isWebPreview = Platform.OS === 'web'

  useEffect(() => {
    if (isWebPreview) {
      return
    }

    if (account && !progress.connectWallet) {
      markStepComplete('connectWallet')
    }
  }, [account, isWebPreview, markStepComplete, progress.connectWallet])

  return (
    <ShellUiPage contentClassName="gap-4 pb-6">
      {isWebPreview ? (
        <>
          <ReadinessUiPreviewBanner />
          <ReadinessUiPreviewProgressHeader
            learningCompletedCount={learningCompletedCount}
            learningTotalCount={learningTotalCount}
            walletTotalCount={walletTotalCount}
          />
        </>
      ) : (
        <ReadinessUiProgressHeader completedCount={completedCount} totalCount={totalCount} />
      )}

      {isAllComplete && !isWebPreview ? <ReadinessUiCompletionBadge /> : null}

      <Text className="text-sm leading-5 text-muted">
        Wallet steps require real wallet interaction. Learning and safety steps are self-checks.
      </Text>

      <ReadinessUiStepCard
        complete={isWebPreview ? false : isStepComplete('connectWallet')}
        completeLabel={!isWebPreview && isStepComplete('connectWallet') ? 'Connected' : undefined}
        description="Connect your mobile wallet through Mobile Wallet Adapter."
        icon="wallet-outline"
        title="Connect wallet"
      >
        <View className="gap-3">
          <Text className="text-sm text-muted">
            {account
              ? `Connected: ${ellipsify(account.address.toString())}`
              : 'Not connected right now'}
          </Text>
          {account ? (
            <ReadinessUiPressable
              className="items-center rounded-xl border border-neutral-300 px-4 py-2 dark:border-neutral-700"
              onPress={() => void disconnect()}
            >
              <Text className="text-sm font-semibold text-neutral-900 dark:text-white">Disconnect</Text>
            </ReadinessUiPressable>
          ) : (
            <WalletUiConnectButton connect={connect} />
          )}
        </View>
      </ReadinessUiStepCard>

      <ReadinessUiStepCard
        complete={isWebPreview ? false : isStepComplete('safeSignature')}
        completeLabel={!isWebPreview && isStepComplete('safeSignature') ? 'Signed' : undefined}
        description="Confirm your wallet can sign a harmless test message."
        icon="create-outline"
        title="Test safe signature"
      >
        {account ? (
          <ReadinessUiSignMessageStep
            complete={isWebPreview ? false : isStepComplete('safeSignature')}
            signMessages={signMessages}
            walletAddress={account.address}
            onSuccess={() => markStepComplete('safeSignature')}
          />
        ) : (
          <Text className="text-sm text-muted">
            {Platform.OS === 'web'
              ? 'Sign-message testing requires the Android development build with an active wallet connection.'
              : isStepComplete('connectWallet')
                ? 'Reconnect your wallet to run the signature test.'
                : 'Connect your wallet first to run the signature test.'}
          </Text>
        )}
      </ReadinessUiStepCard>

      {READINESS_CONCEPTS.map((concept) => (
        <ReadinessUiStepCard
          key={concept.step}
          complete={isStepComplete(concept.step)}
          completeLabel="Read"
          description="Read the short explanation, then mark it as read."
          icon="book-outline"
          title={`Understand ${concept.title}`}
        >
          <ReadinessUiConceptCard
            body={concept.body}
            complete={isStepComplete(concept.step)}
            onAcknowledge={() => markStepComplete(concept.step)}
          />
        </ReadinessUiStepCard>
      ))}

      <ReadinessUiStepCard
        complete={isStepComplete('trustedResources')}
        completeLabel="Official resource opened"
        description="Open at least one official resource before continuing."
        icon="link-outline"
        title="Open trusted resources"
      >
        <View className="gap-2">
          {TRUSTED_RESOURCES.map((resource) => (
            <ReadinessUiResourceLink
              key={resource.url}
              title={resource.title}
              url={resource.url}
              onOpen={() => markStepComplete('trustedResources')}
            />
          ))}
        </View>
        {isStepComplete('trustedResources') ? (
          <Text className="text-sm font-medium text-green-600 dark:text-green-400">
            Official resource opened
          </Text>
        ) : null}
      </ReadinessUiStepCard>

      <ReadinessUiStepCard
        complete={isStepComplete('safetyHabits')}
        completeLabel="Self-check complete"
        description="Confirm the habits you want to follow before using new dApps."
        icon="shield-outline"
        title="Complete basic safety self-check"
      >
        <ReadinessUiSafetyChecklist
          habits={SAFETY_HABITS}
          values={progress.safetyHabits}
          onToggle={toggleSafetyHabit}
        />
        {isStepComplete('safetyHabits') ? (
          <Text className="text-sm font-medium text-green-600 dark:text-green-400">Self-check complete</Text>
        ) : (
          <Text className="text-sm text-muted">Check each habit you want to follow.</Text>
        )}
        <Text className="text-sm text-muted">
          This is a personal readiness check, not a security scan.
        </Text>
      </ReadinessUiStepCard>
    </ShellUiPage>
  )
}
