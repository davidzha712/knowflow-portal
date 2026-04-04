import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { customers, licenses } from "@/lib/db/schema";
import { generateLicenseKey, signLicense } from "@/lib/license/rsa";

// ---------------------------------------------------------------------------
// Tier mapping: Lemon Squeezy variant ID -> license tier
// ---------------------------------------------------------------------------
const VARIANT_TIER_MAP: Record<string, "free" | "pro" | "enterprise"> = {
  [process.env.LS_VARIANT_PRO ?? ""]: "pro",
  [process.env.LS_VARIANT_ENTERPRISE ?? ""]: "enterprise",
};

function tierFromVariantId(variantId: string): "free" | "pro" | "enterprise" {
  return VARIANT_TIER_MAP[variantId] ?? "pro";
}

function expiryForTier(tier: string): Date {
  const now = new Date();
  switch (tier) {
    case "enterprise":
      return new Date(now.setFullYear(now.getFullYear() + 2));
    case "pro":
      return new Date(now.setFullYear(now.getFullYear() + 1));
    default:
      return new Date(now.setFullYear(now.getFullYear() + 1));
  }
}

function maxActivationsForTier(tier: string): number {
  switch (tier) {
    case "enterprise":
      return 10;
    case "pro":
      return 3;
    default:
      return 1;
  }
}

// ---------------------------------------------------------------------------
// Webhook signature verification
// ---------------------------------------------------------------------------
function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string,
): boolean {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("LEMON_SQUEEZY_WEBHOOK_SECRET is not configured");
  }

  const hmac = createHmac("sha256", secret);
  hmac.update(rawBody);
  const digest = hmac.digest("hex");

  try {
    return timingSafeEqual(
      Buffer.from(digest),
      Buffer.from(signatureHeader),
    );
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// POST /api/webhooks/lemon-squeezy
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature") ?? "";

    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 },
      );
    }

    const payload: unknown = JSON.parse(rawBody);
    const event = (payload as Record<string, unknown>).meta as
      | Record<string, unknown>
      | undefined;
    const eventName = event?.event_name as string | undefined;

    if (eventName !== "order_created") {
      // Acknowledge events we don't handle
      return NextResponse.json({ received: true });
    }

    // Extract order data from Lemon Squeezy webhook payload
    const data = (payload as Record<string, unknown>).data as Record<
      string,
      unknown
    >;
    const attributes = data?.attributes as Record<string, unknown>;

    const customerEmail = attributes?.user_email as string;
    const customerName = attributes?.user_name as string | undefined;
    const orderId = String(data?.id ?? "");
    const firstOrderItem = (attributes?.first_order_item as Record<string, unknown>) ?? {};
    const variantId = String(firstOrderItem?.variant_id ?? "");

    if (!customerEmail || !orderId) {
      return NextResponse.json(
        { error: "Missing required order data" },
        { status: 400 },
      );
    }

    const tier = tierFromVariantId(variantId);

    // Find or create customer -- use Clerk ID if available in custom data,
    // otherwise fall back to email-based lookup
    const customData = (event?.custom_data as Record<string, string>) ?? {};
    const clerkId = customData.clerk_id ?? `ls_${customerEmail}`;

    let customer = await db.query.customers.findFirst({
      where: eq(customers.clerkId, clerkId),
    });

    if (!customer) {
      const [created] = await db
        .insert(customers)
        .values({
          clerkId,
          email: customerEmail,
          name: customerName ?? null,
        })
        .returning();
      customer = created;
    }

    // Create license
    const expiresAt = expiryForTier(tier);
    const licenseKey = generateLicenseKey(customer.id, tier, expiresAt);

    signLicense({
      customerId: customer.id,
      tier,
      licenseKey,
      expiresAt: expiresAt.toISOString(),
    });

    await db.insert(licenses).values({
      customerId: customer.id,
      tier,
      licenseKey,
      maxActivations: maxActivationsForTier(tier),
      expiresAt,
      lemonSqueezyOrderId: orderId,
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook processing failed";
    // Always return 200 for webhook endpoints to prevent retries on app errors
    // Return 500 only for truly unexpected failures
    console.error("Lemon Squeezy webhook error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
