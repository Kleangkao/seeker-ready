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
import { ReadinessUiSection } from '@/features/readiness/ui/readiness-ui-section'
import { ReadinessUiSignMessageStep } from '@/features/readiness/ui/readiness-ui-sign-message-step'
import { ReadinessUiPressable } from '@/features/readiness/ui/readiness-ui-pressable'
import { ReadinessUiStepCard } from '@/features/readiness/ui/readiness-ui-step-card'
import { ShellUiPage } from '@/features/shell/ui/shell-ui-page'
import {
  SURFACE_BUTTON,
  TEXT_ON_SURFACE_MUTED,
  TEXT_ON_SURFACE_TITLE,
} from '@/features/shell/ui/shell-ui-surface-styles'
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
    walletCompletedCount,
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
    <ShellUiPage contentClassName="gap-5 pb-6">
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

      <ReadinessUiSection
        description="Prove your wallet connects and can sign a harmless test message. These steps require a real MWA wallet — not available in web preview."
        icon="wallet-outline"
        title="Wallet readiness"
      >
        <ReadinessUiStepCard
          complete={isWebPreview ? false : isStepComplete('connectWallet')}
          completeLabel={!isWebPreview && isStepComplete('connectWallet') ? 'Connected' : undefined}
          description="Connect through Mobile Wallet Adapter. Your keys stay in your wallet app."
          icon="wallet-outline"
          title="Connect wallet"
        >
          <View className="gap-3">
            <Text className={`text-sm ${TEXT_ON_SURFACE_MUTED}`}>
              {account
                ? `Connected: ${ellipsify(account.address.toString())}`
                : 'Not connected right now'}
            </Text>
            {account ? (
              <ReadinessUiPressable
                className={`items-center px-4 py-2 ${SURFACE_BUTTON}`}
                onPress={() => void disconnect()}
              >
                <Text className={`text-sm font-semibold ${TEXT_ON_SURFACE_TITLE}`}>Disconnect</Text>
              </ReadinessUiPressable>
            ) : (
              <WalletUiConnectButton connect={connect} />
            )}
          </View>
        </ReadinessUiStepCard>

        <ReadinessUiStepCard
          complete={isWebPreview ? false : isStepComplete('safeSignature')}
          completeLabel={!isWebPreview && isStepComplete('safeSignature') ? 'Verified' : undefined}
          description="Sign a fixed test message locally verified in the app. No funds move."
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
            <Text className={`text-sm ${TEXT_ON_SURFACE_MUTED}`}>
              {Platform.OS === 'web'
                ? 'Sign-message testing requires the Android development build with an active wallet connection.'
                : isStepComplete('connectWallet')
                  ? 'Reconnect your wallet to run the signature test.'
                  : 'Connect your wallet first to run the signature test.'}
            </Text>
          )}
        </ReadinessUiStepCard>

        {!isWebPreview ? (
          <Text className={`text-xs leading-5 ${TEXT_ON_SURFACE_MUTED}`}>
            {walletCompletedCount}/{walletTotalCount} wallet steps complete
          </Text>
        ) : null}
      </ReadinessUiSection>

      <ReadinessUiSection
        description="Short explanations of core Solana Mobile ideas. Read each card, then mark it when the key point makes sense."
        icon="book-outline"
        title="Learn the basics"
      >
        {READINESS_CONCEPTS.map((concept) => (
          <ReadinessUiConceptCard
            key={concept.step}
            complete={isStepComplete(concept.step)}
            icon={concept.icon}
            remember={concept.remember}
            summary={concept.summary}
            title={concept.title}
            whyItMatters={concept.whyItMatters}
            onAcknowledge={() => markStepComplete(concept.step)}
          />
        ))}
      </ReadinessUiSection>

      <ReadinessUiSection
        description="Know where to get official help and confirm habits you want to follow. These are self-checks — not a security scan."
        icon="shield-outline"
        title="Stay safe and get help"
      >
        <ReadinessUiStepCard
          complete={isStepComplete('trustedResources')}
          completeLabel="Link opened"
          description="Bookmark official sources so you know where to look when something feels unclear."
          icon="help-buoy-outline"
          title="Official help resources"
        >
          <View className="gap-3">
            {TRUSTED_RESOURCES.map((resource) => (
              <ReadinessUiResourceLink
                key={resource.url}
                description={resource.description}
                title={resource.title}
                url={resource.url}
                useWhen={resource.useWhen}
                onOpen={() => markStepComplete('trustedResources')}
              />
            ))}
            {isStepComplete('trustedResources') ? (
              <Text className="text-sm font-medium text-green-300">
                At least one official resource opened
              </Text>
            ) : (
              <Text className={`text-sm ${TEXT_ON_SURFACE_MUTED}`}>
                Open any link above — you do not need to read the whole site.
              </Text>
            )}
          </View>
        </ReadinessUiStepCard>

        <ReadinessUiStepCard
          complete={isStepComplete('safetyHabits')}
          completeLabel="Self-check done"
          description="Tap the habits you plan to follow before using new dApps."
          icon="checkbox-outline"
          title="Safety self-check"
        >
          <ReadinessUiSafetyChecklist
            habits={SAFETY_HABITS}
            values={progress.safetyHabits}
            onToggle={toggleSafetyHabit}
          />
          {isStepComplete('safetyHabits') ? (
            <Text className="text-sm font-medium text-green-300">
              Self-check complete
            </Text>
          ) : (
            <Text className={`text-sm ${TEXT_ON_SURFACE_MUTED}`}>Check each habit you want to follow.</Text>
          )}
          <Text className={`text-sm ${TEXT_ON_SURFACE_MUTED}`}>
            This is a personal readiness check, not a security scan or wallet audit.
          </Text>
        </ReadinessUiStepCard>
      </ReadinessUiSection>
    </ShellUiPage>
  )
}
