import { and, eq, isNull } from "drizzle-orm";
import type { Database } from "@/lib/db";
import { activations, licenses } from "@/lib/db/schema";
import {
  generateActivationCode,
  parseActivationRequest,
} from "./rsa";

// ---------------------------------------------------------------------------
// Activate a license
// ---------------------------------------------------------------------------
export async function activateLicense(
  db: Database,
  licenseId: string,
  requestCode: string,
) {
  const { machineFingerprint } = parseActivationRequest(requestCode);

  // 1. Fetch and validate the license
  const license = await db.query.licenses.findFirst({
    where: eq(licenses.id, licenseId),
  });

  if (!license) {
    throw new Error("License not found");
  }

  if (license.status !== "active") {
    throw new Error(`License is ${license.status}`);
  }

  if (license.expiresAt < new Date()) {
    throw new Error("License has expired");
  }

  // 2. Count active (non-revoked) activations
  const activeActivations = await db.query.activations.findMany({
    where: and(
      eq(activations.licenseId, licenseId),
      isNull(activations.revokedAt),
    ),
  });

  const maxActivations = license.maxActivations ?? 1;
  if (activeActivations.length >= maxActivations) {
    throw new Error(
      `Maximum activations reached (${maxActivations}). Revoke an existing activation first.`,
    );
  }

  // 3. Check for duplicate machine fingerprint
  const existingActivation = activeActivations.find(
    (a) => a.machineFingerprint === machineFingerprint,
  );
  if (existingActivation) {
    return {
      activationId: existingActivation.id,
      activationCode: existingActivation.activationCode,
      alreadyActivated: true,
    };
  }

  // 4. Generate activation code and persist
  const activationCode = generateActivationCode(
    license.licenseKey,
    machineFingerprint,
  );

  const [inserted] = await db
    .insert(activations)
    .values({
      licenseId,
      machineFingerprint,
      activationCode,
    })
    .returning();

  return {
    activationId: inserted.id,
    activationCode: inserted.activationCode,
    alreadyActivated: false,
  };
}

// ---------------------------------------------------------------------------
// Revoke an activation
// ---------------------------------------------------------------------------
export async function revokeActivation(db: Database, activationId: string) {
  const [updated] = await db
    .update(activations)
    .set({ revokedAt: new Date() })
    .where(
      and(eq(activations.id, activationId), isNull(activations.revokedAt)),
    )
    .returning();

  if (!updated) {
    throw new Error("Activation not found or already revoked");
  }

  return updated;
}

