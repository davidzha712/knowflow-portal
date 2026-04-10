import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth/admin"
import { db } from "@/lib/db"
import { licenses, type NewLicense } from "@/lib/db/schema"
import { generateLicenseKey, signLicense } from "@/lib/license/rsa"
import {
  decodeActivationRequest,
  generateKnowFlowLicenseKey,
} from "@/lib/license/knowflow-format"

const issueSchema = z.object({
  customerId: z.string().uuid(),
  tier: z.enum(["free", "pro", "enterprise"]),
  maxActivations: z.number().int().min(1).default(3),
  expiresAt: z.string().datetime(),
  // Optional: activation request from KnowFlow-AI instance
  activationRequest: z.string().optional(),
})

/**
 * POST /api/admin/licenses/issue — Admin manually issues a license.
 *
 * If activationRequest is provided, also generates a KnowFlow-AI compatible
 * license key that can be directly activated on the target machine.
 */
export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body: unknown = await request.json()
    const parsed = issueSchema.parse(body)

    const expiresAt = new Date(parsed.expiresAt)

    // Generate portal license key (for DB tracking)
    const portalLicenseKey = generateLicenseKey(
      parsed.customerId,
      parsed.tier,
      expiresAt,
    )

    // Sign for portal verification
    const signature = signLicense({
      customerId: parsed.customerId,
      tier: parsed.tier,
      licenseKey: portalLicenseKey,
      expiresAt: expiresAt.toISOString(),
    })

    // Store in database (signature persisted alongside the license)
    const newLicense: NewLicense = {
      customerId: parsed.customerId,
      tier: parsed.tier,
      licenseKey: portalLicenseKey,
      maxActivations: parsed.maxActivations,
      expiresAt,
      signature,
    }
    const [created] = await db.insert(licenses).values(newLicense).returning()

    // If activation request provided, generate KnowFlow-AI format key
    let knowflowLicenseKey: string | null = null
    if (parsed.activationRequest) {
      try {
        const { fingerprint } = decodeActivationRequest(parsed.activationRequest)
        const tierUpper = parsed.tier.toUpperCase() as "FREE" | "PRO" | "ENTERPRISE"
        knowflowLicenseKey = generateKnowFlowLicenseKey(tierUpper, expiresAt, fingerprint)
      } catch (err) {
        // Return partial success — portal license created but KnowFlow key failed
        return NextResponse.json(
          {
            success: true,
            data: created,
            knowflowLicenseKey: null,
            knowflowKeyError: err instanceof Error ? err.message : "Failed to generate",
          },
          { status: 201 },
        )
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: created,
        knowflowLicenseKey,
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 },
      )
    }
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
