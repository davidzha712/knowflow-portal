import { randomUUID } from "node:crypto"
import { NextResponse } from "next/server"
import { desc, eq } from "drizzle-orm"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth/admin"
import { db } from "@/lib/db"
import { customers } from "@/lib/db/schema"

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const all = await db.query.customers.findMany({
    with: { licenses: true },
    orderBy: [desc(customers.createdAt)],
  })

  return NextResponse.json({
    data: all.map((c) => ({
      ...c,
      licenseCount: c.licenses.length,
    })),
  })
}

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().max(200).optional(),
  company: z.string().max(200).optional(),
})

/**
 * POST /api/admin/customers — Admin creates a customer manually.
 */
export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body: unknown = await request.json()
    const parsed = createSchema.parse(body)

    // Check if email already exists
    const existing = await db.query.customers.findFirst({
      where: eq(customers.email, parsed.email),
    })
    if (existing) {
      return NextResponse.json({
        success: true,
        data: existing,
        message: "Customer already exists",
      })
    }

    // Create with a UUID-based clerkId (admin-created customers don't have Clerk accounts)
    const [created] = await db
      .insert(customers)
      .values({
        clerkId: `manual_${randomUUID()}`,
        email: parsed.email,
        name: parsed.name ?? null,
        company: parsed.company ?? null,
      })
      .returning()

    return NextResponse.json({ success: true, data: created }, { status: 201 })
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
