import { NextResponse } from "next/server"
import { desc } from "drizzle-orm"
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
