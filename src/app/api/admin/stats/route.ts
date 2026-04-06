import { NextResponse } from "next/server"
import { sql } from "drizzle-orm"
import { requireAdmin } from "@/lib/auth/admin"
import { db } from "@/lib/db"
import { customers, licenses, activations } from "@/lib/db/schema"

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const [custCount] = await db.select({ count: sql<number>`count(*)` }).from(customers)
  const [licCount] = await db.select({ count: sql<number>`count(*)` }).from(licenses)
  const [actCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(activations)
    .where(sql`${activations.revokedAt} IS NULL`)

  return NextResponse.json({
    customers: Number(custCount.count),
    licenses: Number(licCount.count),
    activeActivations: Number(actCount.count),
  })
}
