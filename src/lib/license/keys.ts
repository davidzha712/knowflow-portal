// Shared RSA private key accessor for license signing.
// Env vars often store newlines as literal \n which must be restored.
export function getPrivateKey(): string {
  const key = process.env.KNOWFLOW_RSA_PRIVATE_KEY
  if (!key) {
    throw new Error("KNOWFLOW_RSA_PRIVATE_KEY is not configured")
  }
  return key.replace(/\\n/g, "\n")
}
