import {
  type Address,
  type OffchainMessage,
  getOffchainMessageDecoder,
  getOffchainMessageEnvelopeDecoder,
  isSolanaError,
  SOLANA_ERROR__OFFCHAIN_MESSAGE__SIGNATURE_VERIFICATION_FAILURE,
  verifyOffchainMessageEnvelope,
} from '@solana/kit'
import type { useMobileWallet } from '@wallet-ui/react-native-kit'

export class WalletSignMessageVerificationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WalletSignMessageVerificationError'
  }
}

function getOffchainMessageText(message: OffchainMessage) {
  return typeof message.content === 'string' ? message.content : message.content.text
}

export async function executeAndVerifyWalletSignMessage({
  expectedMessage,
  signMessages,
  walletAddress,
}: {
  expectedMessage: string
  signMessages: ReturnType<typeof useMobileWallet>['signMessages']
  walletAddress: Address
}) {
  const messageBytes = new TextEncoder().encode(expectedMessage)
  const signedPayload = await signMessages(messageBytes)

  if (!signedPayload) {
    throw new Error('Message signed but no signed payload was returned by the wallet adapter.')
  }

  const signedBytes = signedPayload instanceof Uint8Array ? signedPayload : signedPayload[0]

  if (!signedBytes?.length) {
    throw new Error('Message signed but the wallet returned an empty signed payload.')
  }

  let envelope

  try {
    envelope = getOffchainMessageEnvelopeDecoder().decode(signedBytes)
  } catch {
    throw new WalletSignMessageVerificationError(
      'Could not decode the signed message returned by the wallet.',
    )
  }

  try {
    await verifyOffchainMessageEnvelope(envelope)
  } catch (error) {
    if (isSolanaError(error, SOLANA_ERROR__OFFCHAIN_MESSAGE__SIGNATURE_VERIFICATION_FAILURE)) {
      throw new WalletSignMessageVerificationError(
        'Your wallet signed the message, but local verification against the connected address failed. Please try again.',
      )
    }

    throw error
  }

  const offchainMessage = getOffchainMessageDecoder().decode(envelope.content)
  const signedText = getOffchainMessageText(offchainMessage)

  if (signedText !== expectedMessage) {
    throw new WalletSignMessageVerificationError(
      'Signed message text did not match the expected test message.',
    )
  }

  if (!(walletAddress in envelope.signatures) || envelope.signatures[walletAddress] == null) {
    throw new WalletSignMessageVerificationError(
      'The signature was not created by the currently connected wallet address.',
    )
  }

  return { signedText, walletAddress }
}
