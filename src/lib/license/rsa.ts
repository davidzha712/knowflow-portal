import {
  createSign,
  generateKeyPairSync,
  randomBytes,
} from "node:crypto";
import { getPrivateKey } from "./keys";

type Tier = "free" | "pro" | "enterprise";

interface LicenseData {
  customerId: string;
  tier: Tier;
  licenseKey: string;
  expiresAt: string; // ISO 8601
}

// ---------------------------------------------------------------------------
// Key pair generation (run once via scripts/generate-keys.ts)
// ---------------------------------------------------------------------------
export function generateKeyPair() {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  return { publicKey, privateKey };
}

// ---------------------------------------------------------------------------
// License key generation
// ---------------------------------------------------------------------------
export function generateLicenseKey(
  _customerId: string,
  tier: Tier,
  _expiresAt: Date,
): string {
  const random = randomBytes(6).toString("hex").toUpperCase();
  const tierLabel = tier.toUpperCase().slice(0, 3); // FRE, PRO, ENT
  return `KF-${tierLabel}-${random}`;
}

// ---------------------------------------------------------------------------
// RSA signing / verification
// ---------------------------------------------------------------------------
export function signLicense(data: LicenseData): string {
  const sign = createSign("SHA256");
  sign.update(JSON.stringify(data));
  sign.end();
  return sign.sign(getPrivateKey(), "base64");
}

// ---------------------------------------------------------------------------
// Machine-bound activation codes
// ---------------------------------------------------------------------------
export function generateActivationCode(
  licenseKey: string,
  machineFingerprint: string,
): string {
  const payload = JSON.stringify({ licenseKey, machineFingerprint });
  const sign = createSign("SHA256");
  sign.update(payload);
  sign.end();
  const signature = sign.sign(getPrivateKey(), "base64");

  return Buffer.from(
    JSON.stringify({ licenseKey, machineFingerprint, signature }),
  ).toString("base64");
}

// ---------------------------------------------------------------------------
// Activation request parsing
// ---------------------------------------------------------------------------
interface ActivationRequest {
  machineFingerprint: string;
  licenseKey?: string;
}

export function parseActivationRequest(requestCode: string): ActivationRequest {
  try {
    const decoded = Buffer.from(requestCode, "base64").toString("utf-8");
    const parsed: unknown = JSON.parse(decoded);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("machineFingerprint" in parsed) ||
      typeof (parsed as Record<string, unknown>).machineFingerprint !== "string"
    ) {
      throw new Error("Invalid activation request format");
    }

    const result: ActivationRequest = {
      machineFingerprint: (parsed as Record<string, unknown>)
        .machineFingerprint as string,
    };

    if (
      "licenseKey" in parsed &&
      typeof (parsed as Record<string, unknown>).licenseKey === "string"
    ) {
      return { ...result, licenseKey: (parsed as Record<string, unknown>).licenseKey as string };
    }

    return result;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Invalid activation request: malformed base64 or JSON");
    }
    throw error;
  }
}
