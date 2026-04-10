import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { z } from "zod"
import { getCheckoutUrl, variantIdForTier } from "@/lib/lemon-squeezy/client"

const checkoutSchema = z.object({
  tier: z.enum(["pro", "enterprise"]),
  redirectUrl: z.string().url().optional(),
})

// POST /api/checkout — create a Lemon Squeezy checkout session for the
// authenticated user and return its hosted URL. The client redirects the
// browser to the returned URL to complete purchase.
export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      )
    }

    const body: unknown = await request.json()
    const { tier, redirectUrl } = checkoutSchema.parse(body)

    const user = await currentUser()
    const email = user?.primaryEmailAddress?.emailAddress

    const variantId = variantIdForTier(tier)
    const url = await getCheckoutUrl(variantId, {
      customerEmail: email,
      customData: { clerk_id: userId },
      redirectUrl,
    })

    return NextResponse.json({ success: true, url })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 },
      )
    }
    const message =
      error instanceof Error ? error.message : "Checkout creation failed"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
