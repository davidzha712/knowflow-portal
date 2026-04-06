#!/usr/bin/env npx tsx
/**
 * Verify the RSA key chain between knowflow-portal and KnowFlow-AI.
 *
 * Tests:
 * 1. Private key can sign, public key can verify
 * 2. Node.js signature matches Python's expected format
 * 3. Cross-system license format is valid
 *
 * Usage: npx tsx scripts/verify-key-chain.ts
 */

import { createSign, createVerify, createPublicKey, createPrivateKey } from "node:crypto"
import * as dotenv from "dotenv"
import { resolve } from "node:path"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

// The SAME public key embedded in KnowFlow-AI backend/app/core/license.py
const KNOWFLOW_EMBEDDED_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxCiVsO6ig4a29eDCb52Q
CcQVq2lBgYgw72vmGAmH0Yzz/cbg1kYk+p7AUMePPuJiZXAeeB4pPrapkorWSE0V
aYrfZcEUmevymUC43G9VGorjCwMByMqvOxi6ciM1ruqbMCL0m/+EFnuD12BaDrDV
Ay5DWf2RkslYbbHauTS8pYfELgvsIadwmjlswA4c99Bo91GpjcVnxG3l6f5lt7Dh
9koDWFlEFDU9oP4yH5BaQo9SY5u4YQGR8jDvp+Mra1wfPF4lC9OrvBiXI2aPermR
F9gmqQJGoTmjS9UuKPO9+ih8/Kj3ewPY2TUnzJGGioOKHHNBgZrGe4joLXmxSLdD
yQIDAQAB
-----END PUBLIC KEY-----`

function getPrivateKey(): string {
  const key = process.env.KNOWFLOW_RSA_PRIVATE_KEY
  if (!key) throw new Error("KNOWFLOW_RSA_PRIVATE_KEY not set in .env.local")
  return key.replace(/\\n/g, "\n")
}

function getPortalPublicKey(): string {
  const key = process.env.KNOWFLOW_RSA_PUBLIC_KEY
  if (!key) throw new Error("KNOWFLOW_RSA_PUBLIC_KEY not set in .env.local")
  return key.replace(/\\n/g, "\n")
}

// ── Test 1: Key pair identity ──────────────────────────────

function testKeyPairIdentity() {
  console.log("Test 1: Key pair identity check...")

  const privatePem = getPrivateKey()
  const portalPublicPem = getPortalPublicKey()

  // Derive public key from private key
  const privateKeyObj = createPrivateKey(privatePem)
  const derivedPublicPem = privateKeyObj
    .export({ type: "spki", format: "pem" })
    .toString()
    .trim()

  // Normalize for comparison (remove whitespace/newlines)
  const normalizeKey = (pem: string) =>
    pem.replace(/-----[^-]+-----/g, "").replace(/\s/g, "")

  const derivedNorm = normalizeKey(derivedPublicPem)
  const embeddedNorm = normalizeKey(KNOWFLOW_EMBEDDED_PUBLIC_KEY)
  const portalNorm = normalizeKey(portalPublicPem)

  if (derivedNorm === embeddedNorm) {
    console.log("  ✅ Private key matches KnowFlow-AI embedded public key")
  } else {
    console.log("  ❌ MISMATCH: Private key does NOT match KnowFlow-AI embedded public key!")
    console.log("     Derived:  ", derivedNorm.slice(0, 40) + "...")
    console.log("     Embedded: ", embeddedNorm.slice(0, 40) + "...")
  }

  if (portalNorm === embeddedNorm) {
    console.log("  ✅ Portal public key matches KnowFlow-AI embedded public key")
  } else {
    console.log("  ❌ MISMATCH: Portal public key does NOT match KnowFlow-AI embedded key!")
    console.log("     Portal:   ", portalNorm.slice(0, 40) + "...")
    console.log("     Embedded: ", embeddedNorm.slice(0, 40) + "...")
  }
}

// ── Test 2: Sign with Node.js, verify with "Python logic" ──

function testCrossSystemSignature() {
  console.log("\nTest 2: Cross-system signature verification...")

  const tier = "PRO"
  const expiry = "20271231"
  const fingerprint = "abcdef0123456789"

  // Sign (matching knowflow-format.ts)
  const message = `${tier}:${expiry}:${fingerprint}`
  const sign = createSign("SHA256")
  sign.update(message)
  sign.end()
  const signature = sign.sign(getPrivateKey())

  // Encode as URL-safe base64 WITH padding (matching Python)
  const sigB64 = signature
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")

  console.log(`  Message: "${message}"`)
  console.log(`  Signature (first 40 chars): ${sigB64.slice(0, 40)}...`)
  console.log(`  Signature length: ${sigB64.length}`)
  console.log(`  Has padding: ${sigB64.endsWith("=")}`)

  // Verify using the EMBEDDED public key (simulating Python's validation)
  const sigBytes = Buffer.from(sigB64, "base64url") // base64url handles padding correctly
  const verify = createVerify("SHA256")
  verify.update(message)
  verify.end()
  const isValid = verify.verify(KNOWFLOW_EMBEDDED_PUBLIC_KEY, sigBytes)

  if (isValid) {
    console.log("  ✅ Signature verified with KnowFlow-AI embedded public key")
  } else {
    console.log("  ❌ Signature FAILED verification with KnowFlow-AI embedded public key!")
  }

  // Build full license key
  const licenseKey = `KF-${tier}-${expiry}-${fingerprint}-${sigB64}`
  console.log(`  License key (truncated): ${licenseKey.slice(0, 60)}...`)

  return isValid
}

// ── Test 3: Full license key parse + verify ─────────────────

function testLicenseKeyParsing() {
  console.log("\nTest 3: Full license key parsing and verification...")

  const tier = "ENTERPRISE"
  const expiry = "20281231"
  const fingerprint = "1234567890abcdef"

  const message = `${tier}:${expiry}:${fingerprint}`
  const sign = createSign("SHA256")
  sign.update(message)
  sign.end()
  const sigB64 = sign
    .sign(getPrivateKey())
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")

  const licenseKey = `KF-${tier}-${expiry}-${fingerprint}-${sigB64}`

  // Parse like Python does: parts = license_key.split("-")
  const parts = licenseKey.split("-")
  if (parts[0] !== "KF") {
    console.log("  ❌ Invalid prefix")
    return false
  }

  const parsedTier = parts[1]
  const parsedExpiry = parts[2]
  const parsedFp = parts[3]
  // Signature may contain dashes in base64url encoding
  const parsedSig = parts.slice(4).join("-")

  console.log(`  Parsed tier: ${parsedTier}`)
  console.log(`  Parsed expiry: ${parsedExpiry}`)
  console.log(`  Parsed fingerprint: ${parsedFp}`)
  console.log(`  Parsed sig length: ${parsedSig.length}`)

  // Verify
  const verifyMsg = `${parsedTier}:${parsedExpiry}:${parsedFp}`
  const sigBytes = Buffer.from(parsedSig, "base64url")
  const verify = createVerify("SHA256")
  verify.update(verifyMsg)
  verify.end()
  const isValid = verify.verify(KNOWFLOW_EMBEDDED_PUBLIC_KEY, sigBytes)

  if (isValid) {
    console.log("  ✅ Full license key verified successfully")
  } else {
    console.log("  ❌ Full license key verification FAILED!")
  }

  return isValid
}

// ── Run all tests ──────────────────────────────────────────

console.log("=== KnowFlow RSA Key Chain Verification ===\n")

try {
  testKeyPairIdentity()
  const test2 = testCrossSystemSignature()
  const test3 = testLicenseKeyParsing()

  console.log("\n=== Summary ===")
  if (test2 && test3) {
    console.log("✅ All signature tests PASSED — signing chain is valid")
  } else {
    console.log("❌ Some tests FAILED — signing chain is BROKEN")
    process.exit(1)
  }
} catch (err) {
  console.error("\n❌ Error:", (err as Error).message)
  process.exit(1)
}
