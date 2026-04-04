import {
  lemonSqueezySetup,
  createCheckout,
  type NewCheckout,
} from "@lemonsqueezy/lemonsqueezy.js";

// ---------------------------------------------------------------------------
// SDK initialization
// ---------------------------------------------------------------------------
function ensureSetup() {
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
  if (!apiKey) {
    throw new Error("LEMON_SQUEEZY_API_KEY is not configured");
  }
  lemonSqueezySetup({ apiKey });
}

// ---------------------------------------------------------------------------
// Checkout URL generation
// ---------------------------------------------------------------------------
export async function getCheckoutUrl(
  variantId: string,
  options?: {
    customerEmail?: string;
    customData?: Record<string, string>;
    redirectUrl?: string;
  },
): Promise<string> {
  ensureSetup();

  const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
  if (!storeId) {
    throw new Error("LEMON_SQUEEZY_STORE_ID is not configured");
  }

  const checkoutOptions: NewCheckout = {
    checkoutData: {
      email: options?.customerEmail,
      custom: options?.customData ? (Object.entries(options.customData) as unknown as Record<string, string>) : undefined,
    },
    productOptions: {
      redirectUrl: options?.redirectUrl,
    },
  };

  const response = await createCheckout(storeId, variantId, checkoutOptions);

  if (response.error) {
    throw new Error(
      `Failed to create checkout: ${response.error.message}`,
    );
  }

  const checkoutUrl = response.data?.data.attributes.url;
  if (!checkoutUrl) {
    throw new Error("No checkout URL returned from Lemon Squeezy");
  }

  return checkoutUrl;
}
