/**
 * Generate license keys compatible with KnowFlow-AI's license.py validation.
 *
 * Format: KF-{TIER}-{YYYYMMDD}-{FINGERPRINT_HASH}-{URLSAFE_BASE64_RSA_SIG}
 * Signature: PKCS1v15 + SHA256 over "{TIER}:{YYYYMMDD}:{FINGERPRINT_HASH}"
 */

import { createSign } from "node:crypto"
import { getPrivateKey } from "./keys"

type KnowFlowTier = "FREE" | "PRO" | "ENTERPRISE"

/**
 * Decode a base64 activation request from KnowFlow-AI.
 *
 * Request format: urlsafe_base64(JSON{"fingerprint": "16-char-hex", "timestamp": "...", "version": "..."})
 */
export function decodeActivationRequest(requestCode: string): {
  fingerprint: string
  timestamp?: string
  version?: string
} {
  const raw = Buffer.from(requestCode, "base64url").toString("utf-8")
  const parsed: unknown = JSON.parse(raw)

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("fingerprint" in parsed) ||
    typeof (parsed as Record<string, unknown>).fingerprint !== "string"
  ) {
    throw new Error("Invalid activation request format")
  }

  const fp = (parsed as Record<string, unknown>).fingerprint as string
  if (fp.length !== 16 || !/^[0-9a-f]+$/i.test(fp)) {
    throw new Error("Fingerprint must be 16 hex characters")
  }

  return {
    fingerprint: fp,
    timestamp: (parsed as Record<string, unknown>).timestamp as string | undefined,
    version: (parsed as Record<string, unknown>).version as string | undefined,
  }
}

/**
 * Sign a license payload matching KnowFlow-AI's `sign_license_payload()`.
 *
 * Uses PKCS1v15 + SHA256 (matching Python's `padding.PKCS1v15()` + `hashes.SHA256()`).
 * Returns URL-safe base64 encoded signature.
 */
function signPayload(tier: string, expiry: string, fingerprintHash: string): string {
  const message = `${tier}:${expiry}:${fingerprintHash}`
  const sign = createSign("SHA256")
  sign.update(message)
  sign.end()

  const signature = sign.sign(getPrivateKey())
  // URL-safe base64 to match Python's base64.urlsafe_b64encode
  // MUST keep trailing '=' padding — Python's urlsafe_b64decode requires it
  return signature
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}

/**
 * Generate a KnowFlow-AI compatible license key.
 *
 * @param tier - FREE, PRO, or ENTERPRISE
 * @param expiryDate - Expiry date
 * @param fingerprintHash - 16-char hex machine fingerprint
 * @returns License key string: KF-{TIER}-{YYYYMMDD}-{FPHASH}-{SIGNATURE}
 */
/**
 * Generate an unban token for a banned KnowFlow instance.
 *
 * Token: urlsafe_base64(RSA_SIGN("UNBAN:YYYY-MM-DD"))
 * Valid for 24 hours (KnowFlow checks today + yesterday).
 */
export function generateUnbanToken(): string {
  const today = new Date().toISOString().split("T")[0]
  const message = `UNBAN:${today}`
  const sign = createSign("SHA256")
  sign.update(message)
  sign.end()
  const signature = sign.sign(getPrivateKey())
  return signature
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}


export function generateKnowFlowLicenseKey(
  tier: KnowFlowTier,
  expiryDate: Date,
  fingerprintHash: string,
): string {
  const expiry =
    expiryDate.getFullYear().toString() +
    (expiryDate.getMonth() + 1).toString().padStart(2, "0") +
    expiryDate.getDate().toString().padStart(2, "0")

  if (fingerprintHash.length !== 16) {
    throw new Error("Fingerprint hash must be exactly 16 hex characters")
  }

  const sig = signPayload(tier, expiry, fingerprintHash)
  return `KF-${tier}-${expiry}-${fingerprintHash}-${sig}`
}
