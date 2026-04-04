/**
 * Generate RSA key pair for KnowFlow license signing.
 *
 * Run with:  npx tsx scripts/generate-keys.ts
 *
 * The private key goes into the KNOWFLOW_RSA_PRIVATE_KEY env var (Vercel).
 * The public key is embedded in the KnowFlow AI desktop product for
 * offline license verification.
 */

import { generateKeyPair } from "../src/lib/license/rsa";

function main() {
  const { publicKey, privateKey } = generateKeyPair();

  console.log("=".repeat(72));
  console.log("  KnowFlow RSA Key Pair Generator");
  console.log("=".repeat(72));
  console.log();

  console.log("--- PRIVATE KEY (store in KNOWFLOW_RSA_PRIVATE_KEY env var) ---");
  console.log();
  console.log(privateKey);
  console.log();

  console.log("For .env files, encode newlines:");
  console.log();
  console.log(
    `KNOWFLOW_RSA_PRIVATE_KEY="${privateKey.replace(/\n/g, "\\n")}"`,
  );
  console.log();

  console.log("--- PUBLIC KEY (embed in KnowFlow AI product) ---");
  console.log();
  console.log(publicKey);
  console.log();

  console.log("For env var (KNOWFLOW_RSA_PUBLIC_KEY):");
  console.log();
  console.log(
    `KNOWFLOW_RSA_PUBLIC_KEY="${publicKey.replace(/\n/g, "\\n")}"`,
  );
  console.log();

  console.log("=".repeat(72));
  console.log("  IMPORTANT: Keep the private key secret.");
  console.log("  Add both keys to your Vercel environment variables.");
  console.log("=".repeat(72));
}

main();
