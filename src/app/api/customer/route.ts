import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/lib/db"
import { customers } from "@/lib/db/schema"

const updateSchema = z.object({
  company: z.string().max(200).optional(),
  name: z.string().max(200).optional(),
})

/**
 * PATCH /api/customer — update the authenticated user's customer record.
 */
export async function PATCH(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      )
    }

    const body: unknown = await request.json()
    const parsed = updateSchema.parse(body)

    const [updated] = await db
      .update(customers)
      .set(parsed)
      .where(eq(customers.clerkId, userId))
      .returning()

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 },
      )
    }
    const message =
      error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    )
  }
}

/**
 * GET /api/customer — get the authenticated user's customer record.
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

    const customer = await db.query.customers.findFirst({
      where: eq(customers.clerkId, userId),
    })

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: customer })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    )
  }
}
