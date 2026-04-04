import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { customers, licenses } from "@/lib/db/schema";
import { generateLicenseKey, signLicense } from "@/lib/license/rsa";

// ---------------------------------------------------------------------------
// GET /api/licenses -- list licenses for the authenticated user
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const customer = await db.query.customers.findFirst({
      where: eq(customers.clerkId, userId),
      with: { licenses: true },
    });

    if (!customer) {
      return NextResponse.json({
        success: true,
        data: [],
        meta: { total: 0 },
      });
    }

    return NextResponse.json({
      success: true,
      data: customer.licenses,
      meta: { total: customer.licenses.length },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/licenses -- create a license (internal / webhook use)
// ---------------------------------------------------------------------------
const createLicenseSchema = z.object({
  customerId: z.string().uuid(),
  tier: z.enum(["free", "pro", "enterprise"]),
  maxActivations: z.number().int().min(1).default(1),
  expiresAt: z.string().datetime(),
  lemonSqueezyOrderId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = createLicenseSchema.parse(body);

    const expiresAt = new Date(parsed.expiresAt);
    const licenseKey = generateLicenseKey(
      parsed.customerId,
      parsed.tier,
      expiresAt,
    );

    const licenseData = {
      customerId: parsed.customerId,
      tier: parsed.tier,
      licenseKey,
      expiresAt: expiresAt.toISOString(),
    };
    const signature = signLicense(licenseData);

    const [created] = await db
      .insert(licenses)
      .values({
        customerId: parsed.customerId,
        tier: parsed.tier,
        licenseKey,
        maxActivations: parsed.maxActivations,
        expiresAt,
        lemonSqueezyOrderId: parsed.lemonSqueezyOrderId,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: { ...created, signature },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 },
      );
    }
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
