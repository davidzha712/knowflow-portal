import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth/admin"
import { generateUnbanToken } from "@/lib/license/knowflow-format"

/**
 * POST /api/admin/unban — Generate an unban token for a banned KnowFlow instance.
 *
 * The token is RSA-signed and valid for 24 hours. The customer inputs it at
 * POST /api/v1/admin/system/unban on their KnowFlow instance to lift the ban.
 */
export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body: unknown = await request.json()
    const { reason } = z.object({ reason: z.string().optional().default("") }).parse(body)

    const token = generateUnbanToken()

    return NextResponse.json({
      success: true,
      unban_token: token,
      valid_for: "24 hours",
      instructions: [
        "1. Send this token to the customer",
        "2. Customer goes to KnowFlow Admin > License tab",
        "3. Customer clicks 'Unban' and pastes this token",
        "4. Or via API: POST /api/v1/admin/system/unban with { unban_token: '...' }",
      ],
      generated_at: new Date().toISOString(),
      generated_by: admin.primaryEmailAddress?.emailAddress,
      reason,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate unban token"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
