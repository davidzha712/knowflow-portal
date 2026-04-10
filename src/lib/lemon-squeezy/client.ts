import {
  lemonSqueezySetup,
  createCheckout,
  type NewCheckout,
} from "@lemonsqueezy/lemonsqueezy.js"

function ensureSetup() {
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY
  if (!apiKey) {
    throw new Error("LEMON_SQUEEZY_API_KEY is not configured")
  }
  lemonSqueezySetup({ apiKey })
}

export async function getCheckoutUrl(
  variantId: string,
  options?: {
    customerEmail?: string
    customData?: Record<string, string>
    redirectUrl?: string
  },
): Promise<string> {
  ensureSetup()

  const storeId = process.env.LEMON_SQUEEZY_STORE_ID
  if (!storeId) {
    throw new Error("LEMON_SQUEEZY_STORE_ID is not configured")
  }

  const checkoutOptions: NewCheckout = {
    checkoutData: {
      email: options?.customerEmail,
      custom: options?.customData,
    },
    productOptions: {
      redirectUrl: options?.redirectUrl,
    },
  }

  const response = await createCheckout(storeId, variantId, checkoutOptions)

  if (response.error) {
    throw new Error(`Failed to create checkout: ${response.error.message}`)
  }

  const checkoutUrl = response.data?.data.attributes.url
  if (!checkoutUrl) {
    throw new Error("No checkout URL returned from Lemon Squeezy")
  }

  return checkoutUrl
}

// Map portal tier → Lemon Squeezy variant id (from env).
// Free tier has no paid checkout and is handled outside this module.
export function variantIdForTier(tier: "pro" | "enterprise"): string {
  const variantId =
    tier === "pro"
      ? process.env.LS_VARIANT_PRO
      : process.env.LS_VARIANT_ENTERPRISE
  if (!variantId) {
    throw new Error(
      `Lemon Squeezy variant id for tier "${tier}" is not configured`,
    )
  }
  return variantId
}
