import { NextResponse } from "next/server"
import { desc } from "drizzle-orm"
import { requireAdmin } from "@/lib/auth/admin"
import { db } from "@/lib/db"
import { licenses } from "@/lib/db/schema"

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const all = await db.query.licenses.findMany({
    with: {
      customer: true,
      activations: true,
    },
    orderBy: [desc(licenses.createdAt)],
  })

  return NextResponse.json({
    data: all.map((l) => ({
      ...l,
      customerEmail: l.customer?.email,
      customerName: l.customer?.name,
      activeActivations: (l.activations ?? []).filter((a) => !a.revokedAt).length,
    })),
  })
}
