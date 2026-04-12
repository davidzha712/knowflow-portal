import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  customers,
  licenses,
  type NewCustomer,
  type NewLicense,
} from "@/lib/db/schema";
import { generateLicenseKey, signLicense } from "@/lib/license/rsa";

// ---------------------------------------------------------------------------
// Webhook payload schema
// ---------------------------------------------------------------------------
const webhookPayloadSchema = z.object({
  meta: z.object({
    event_name: z.string(),
    custom_data: z.record(z.string(), z.string()).optional(),
  }),
  data: z.object({
    id: z.union([z.string(), z.number()]),
    attributes: z.object({
      user_email: z.string().email(),
      user_name: z.string().optional(),
      first_order_item: z.object({
        variant_id: z.union([z.string(), z.number()]).optional(),
      }).optional(),
    }),
  }),
})

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
    const webhookSignature = request.headers.get("x-signature") ?? "";

    if (!verifyWebhookSignature(rawBody, webhookSignature)) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 },
      );
    }

    const parseResult = webhookPayloadSchema.safeParse(JSON.parse(rawBody));
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 },
      );
    }

    const { meta, data } = parseResult.data;
    const eventName = meta.event_name;

    if (eventName !== "order_created") {
      // Acknowledge events we don't handle
      return NextResponse.json({ received: true });
    }

    const { attributes } = data;
    const customerEmail = attributes.user_email;
    const customerName = attributes.user_name;
    const orderId = String(data.id);
    const variantId = String(attributes.first_order_item?.variant_id ?? "");

    const tier = tierFromVariantId(variantId);

    // Find or create customer -- use Clerk ID if available in custom data,
    // otherwise fall back to email-based lookup
    const customData: Record<string, string> = meta.custom_data ?? {};
    const clerkId = customData.clerk_id ?? `ls_${customerEmail}`;

    let customer = await db.query.customers.findFirst({
      where: eq(customers.clerkId, clerkId),
    });

    if (!customer) {
      const newCustomer: NewCustomer = {
        clerkId,
        email: customerEmail,
        name: customerName ?? null,
      };
      const [created] = await db
        .insert(customers)
        .values(newCustomer)
        .returning();
      customer = created;
    }

    // Create license
    const expiresAt = expiryForTier(tier);
    const licenseKey = generateLicenseKey(customer.id, tier, expiresAt);
    const licenseSignature = signLicense({
      customerId: customer.id,
      tier,
      licenseKey,
      expiresAt: expiresAt.toISOString(),
    });

    const newLicense: NewLicense = {
      customerId: customer.id,
      tier,
      licenseKey,
      maxActivations: maxActivationsForTier(tier),
      expiresAt,
      lemonSqueezyOrderId: orderId,
      signature: licenseSignature,
    };
    await db.insert(licenses).values(newLicense);

    return NextResponse.json({ received: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook processing failed";
    // Always return 200 for webhook endpoints to prevent retries on app errors
    // Return 500 only for truly unexpected failures
    console.error("Lemon Squeezy webhook error:", message);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
