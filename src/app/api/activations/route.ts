import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { eq, and, isNull, inArray } from "drizzle-orm"
import { db } from "@/lib/db"
import { customers, licenses, activations } from "@/lib/db/schema"

/**
 * GET /api/activations — list all active activations for the authenticated user.
 */
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      )
    }

    // Find customer
    const customer = await db.query.customers.findFirst({
      where: eq(customers.clerkId, userId),
      with: { licenses: true },
    })

    if (!customer || customer.licenses.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        meta: { total: 0 },
      })
    }

    // Get all activations across user's licenses
    const licenseIds = customer.licenses.map((l) => l.id)
    const userActivations = await db.query.activations.findMany({
      where: and(
        inArray(activations.licenseId, licenseIds),
        isNull(activations.revokedAt),
      ),
      orderBy: (a, { desc }) => [desc(a.activatedAt)],
    })

    // Enrich with license key info
    const licenseMap = new Map(
      customer.licenses.map((l) => [l.id, l]),
    )
    const enriched = userActivations.map((act) => {
      const lic = licenseMap.get(act.licenseId)
      return {
        ...act,
        licenseKey: lic?.licenseKey ?? "—",
        licenseTier: lic?.tier ?? "—",
      }
    })

    return NextResponse.json({
      success: true,
      data: enriched,
      meta: { total: enriched.length },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    )
  }
}
