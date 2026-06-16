import {
  type Address,
  type OffchainMessage,
  assertIsSignatureBytes,
  getOffchainMessageDecoder,
  getOffchainMessageEnvelopeDecoder,
  getPublicKeyFromAddress,
  isSolanaError,
  SOLANA_ERROR__OFFCHAIN_MESSAGE__SIGNATURE_VERIFICATION_FAILURE,
  verifyOffchainMessageEnvelope,
  verifySignature,
} from '@solana/kit'
import type { WalletSignMessages } from '@/features/wallet/data-access/wallet-sign-message-types'

const ED25519_SIGNATURE_LENGTH = 64

export class WalletSignMessageVerificationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WalletSignMessageVerificationError'
  }
}

function getOffchainMessageText(message: OffchainMessage) {
  return typeof message.content === 'string' ? message.content : message.content.text
}

function bytesEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) {
    return false
  }

  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      return false
    }
  }

  return true
}

function logSignedPayloadDiagnostics({
  expectedMessage,
  messageBytes,
  signedBytes,
  signedPayload,
  walletAddress,
}: {
  expectedMessage: string
  messageBytes: Uint8Array
  signedBytes: Uint8Array
  signedPayload: Uint8Array | Uint8Array[]
  walletAddress: Address
}) {
  if (!__DEV__) {
    return
  }

  console.log('[wallet-sign] connected address:', walletAddress)
  console.log('[wallet-sign] expected message:', expectedMessage)
  console.log('[wallet-sign] signed payload kind:', Array.isArray(signedPayload) ? 'array' : signedPayload.constructor.name)
  console.log('[wallet-sign] signed bytes length:', signedBytes.length)
  console.log('[wallet-sign] expected message bytes length:', messageBytes.length)
  console.log('[wallet-sign] signed bytes is Uint8Array:', signedBytes instanceof Uint8Array)
}

async function verifyOffchainEnvelopeSignedMessage({
  envelope,
  expectedMessage,
  walletAddress,
}: {
  envelope: ReturnType<ReturnType<typeof getOffchainMessageEnvelopeDecoder>['decode']>
  expectedMessage: string
  walletAddress: Address
}) {
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

async function verifyRawSignedMessagePayload({
  expectedMessage,
  messageBytes,
  signedBytes,
  walletAddress,
}: {
  expectedMessage: string
  messageBytes: Uint8Array
  signedBytes: Uint8Array
  walletAddress: Address
}) {
  let signedMessageBytes = messageBytes
  let signatureBytes: Uint8Array

  if (signedBytes.length === ED25519_SIGNATURE_LENGTH) {
    signatureBytes = signedBytes
  } else if (signedBytes.length === messageBytes.length + ED25519_SIGNATURE_LENGTH) {
    signedMessageBytes = signedBytes.subarray(0, messageBytes.length)
    signatureBytes = signedBytes.subarray(messageBytes.length)

    if (!bytesEqual(signedMessageBytes, messageBytes)) {
      throw new WalletSignMessageVerificationError(
        'Signed message bytes did not match the expected test message.',
      )
    }
  } else {
    throw new WalletSignMessageVerificationError(
      'Could not decode the signed message returned by the wallet.',
    )
  }

  assertIsSignatureBytes(signatureBytes)

  const publicKey = await getPublicKeyFromAddress(walletAddress)
  const signatureValid = await verifySignature(publicKey, signatureBytes, signedMessageBytes)

  if (!signatureValid) {
    throw new WalletSignMessageVerificationError(
      'Your wallet signed the message, but local verification against the connected address failed. Please try again.',
    )
  }

  const signedText = new TextDecoder().decode(signedMessageBytes)

  if (signedText !== expectedMessage) {
    throw new WalletSignMessageVerificationError(
      'Signed message text did not match the expected test message.',
    )
  }

  return { signedText, walletAddress }
}

export async function executeAndVerifyWalletSignMessage({
  expectedMessage,
  signMessages,
  walletAddress,
}: {
  expectedMessage: string
  signMessages: WalletSignMessages
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

  logSignedPayloadDiagnostics({
    expectedMessage,
    messageBytes,
    signedBytes,
    signedPayload,
    walletAddress,
  })

  try {
    const envelope = getOffchainMessageEnvelopeDecoder().decode(signedBytes)
    return await verifyOffchainEnvelopeSignedMessage({
      envelope,
      expectedMessage,
      walletAddress,
    })
  } catch (error) {
    if (error instanceof WalletSignMessageVerificationError) {
      throw error
    }
  }

  return verifyRawSignedMessagePayload({
    expectedMessage,
    messageBytes,
    signedBytes,
    walletAddress,
  })
}
