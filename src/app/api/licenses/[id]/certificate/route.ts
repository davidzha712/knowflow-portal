import { NextResponse, type NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { customers, licenses } from "@/lib/db/schema"
import { generateCertificatePdf } from "@/lib/license/certificate"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      )
    }

    const { id: licenseId } = await params

    // Find the customer
    const customer = await db.query.customers.findFirst({
      where: eq(customers.clerkId, userId),
    })
    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 },
      )
    }

    // Find the license (must belong to this customer)
    const license = await db.query.licenses.findFirst({
      where: eq(licenses.id, licenseId),
    })
    if (!license || license.customerId !== customer.id) {
      return NextResponse.json(
        { success: false, error: "License not found" },
        { status: 404 },
      )
    }

    // Generate PDF
    const pdfBytes = generateCertificatePdf(license, customer)
    const buffer = Buffer.from(pdfBytes)

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="KnowFlow-License-${license.licenseKey}.pdf"`,
      },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    )
  }
}
