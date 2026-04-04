import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  activateLicense,
  revokeActivation,
} from "@/lib/license/activate";

// ---------------------------------------------------------------------------
// POST /api/activate -- activate a license with a request code
// ---------------------------------------------------------------------------
const activateSchema = z.object({
  licenseId: z.string().uuid(),
  requestCode: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body: unknown = await request.json();
    const parsed = activateSchema.parse(body);

    const result = await activateLicense(
      db,
      parsed.licenseId,
      parsed.requestCode,
    );

    return NextResponse.json({
      success: true,
      data: {
        activationId: result.activationId,
        activationCode: result.activationCode,
        alreadyActivated: result.alreadyActivated,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 },
      );
    }
    const message =
      error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("not found")
      ? 404
      : message.includes("expired") || message.includes("revoked")
        ? 403
        : message.includes("Maximum activations")
          ? 409
          : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/activate -- revoke an activation
// ---------------------------------------------------------------------------
const revokeSchema = z.object({
  activationId: z.string().uuid(),
});

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body: unknown = await request.json();
    const parsed = revokeSchema.parse(body);

    const revoked = await revokeActivation(db, parsed.activationId);

    return NextResponse.json({
      success: true,
      data: revoked,
    });
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
      { status: message.includes("not found") ? 404 : 500 },
    );
  }
}
