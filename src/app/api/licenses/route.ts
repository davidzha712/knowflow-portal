import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { customers, licenses } from "@/lib/db/schema";

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

