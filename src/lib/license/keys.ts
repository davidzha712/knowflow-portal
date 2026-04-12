import { createPrivateKey } from "node:crypto"

// Shared RSA private key accessor for license signing.
// Env vars often store newlines as literal \n which must be restored.
export function getPrivateKey(): string {
  const key = process.env.KNOWFLOW_RSA_PRIVATE_KEY
  if (!key) {
    throw new Error("KNOWFLOW_RSA_PRIVATE_KEY is not configured")
  }
  const restored = key.replace(/\\n/g, "\n")
  try {
    createPrivateKey(restored)
  } catch {
    throw new Error("KNOWFLOW_RSA_PRIVATE_KEY is not a valid PEM private key")
  }
  return restored
}
