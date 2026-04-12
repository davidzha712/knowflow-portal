import { NextResponse, type NextRequest } from "next/server"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth/admin"
import { db } from "@/lib/db"
import { licenses } from "@/lib/db/schema"

const updateSchema = z.object({
  tier: z.enum(["free", "pro", "enterprise"]).optional(),
  status: z.enum(["active", "expired", "revoked"]).optional(),
  maxActivations: z.number().int().min(1).optional(),
  expiresAt: z.string().datetime().optional(),
})

/**
 * PATCH /api/admin/licenses/[id] — Update a license.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const body: unknown = await request.json()
  const parsed = updateSchema.parse(body)

  const [updated] = await db
    .update(licenses)
    .set({
      ...(parsed.tier !== undefined && { tier: parsed.tier }),
      ...(parsed.status !== undefined && { status: parsed.status }),
      ...(parsed.maxActivations !== undefined && { maxActivations: parsed.maxActivations }),
      ...(parsed.expiresAt !== undefined && { expiresAt: new Date(parsed.expiresAt) }),
    })
    .where(eq(licenses.id, id))
    .returning()

  if (!updated) {
    return NextResponse.json({ error: "License not found" }, { status: 404 })
  }

  return NextResponse.json({ data: updated })
}

/**
 * DELETE /api/admin/licenses/[id] — Revoke a license.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params

  const [revoked] = await db
    .update(licenses)
    .set({ status: "revoked" })
    .where(eq(licenses.id, id))
    .returning()

  if (!revoked) {
    return NextResponse.json({ error: "License not found" }, { status: 404 })
  }

  return NextResponse.json({ data: revoked })
}
