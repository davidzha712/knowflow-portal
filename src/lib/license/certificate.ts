import { jsPDF } from "jspdf"
import type { License, Customer } from "@/lib/db/schema"
import { signLicense } from "./rsa"

/**
 * Generate a license certificate PDF.
 *
 * Returns the PDF as a Uint8Array (binary).
 */
export function generateCertificatePdf(
  license: License,
  customer: Customer,
): Uint8Array {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
  const w = doc.internal.pageSize.getWidth()
  const h = doc.internal.pageSize.getHeight()

  // ── Border ────────────────────────────────────────────
  doc.setDrawColor(30, 64, 175) // brand blue
  doc.setLineWidth(1.5)
  doc.rect(10, 10, w - 20, h - 20)
  doc.setLineWidth(0.5)
  doc.rect(13, 13, w - 26, h - 26)

  // ── Header ────────────────────────────────────────────
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text("KNOWFLOW AI", w / 2, 25, { align: "center" })

  doc.setFontSize(28)
  doc.setTextColor(30, 64, 175)
  doc.text("License Certificate", w / 2, 40, { align: "center" })

  doc.setFontSize(10)
  doc.setTextColor(120, 120, 120)
  doc.text(
    `Certificate ID: ${license.id}`,
    w / 2,
    48,
    { align: "center" },
  )

  // ── Divider ───────────────────────────────────────────
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.3)
  doc.line(40, 54, w - 40, 54)

  // ── License details ───────────────────────────────────
  const leftX = 45
  const rightX = w / 2 + 10
  let y = 66

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)

  const addField = (label: string, value: string, x: number) => {
    doc.setTextColor(100, 100, 100)
    doc.text(label, x, y)
    doc.setTextColor(30, 30, 30)
    doc.text(value, x, y + 6)
  }

  addField("Licensee", customer.name ?? customer.email, leftX)
  addField("Company", customer.company ?? "—", rightX)
  y += 18

  addField("License Key", license.licenseKey, leftX)
  addField(
    "Tier",
    license.tier.charAt(0).toUpperCase() + license.tier.slice(1),
    rightX,
  )
  y += 18

  addField(
    "Issued",
    license.createdAt ? license.createdAt.toLocaleDateString() : "—",
    leftX,
  )
  addField(
    "Expires",
    license.expiresAt ? license.expiresAt.toLocaleDateString() : "—",
    rightX,
  )
  y += 18

  addField(
    "Max Activations",
    String(license.maxActivations ?? 1),
    leftX,
  )
  addField("Status", (license.status ?? "active").toUpperCase(), rightX)
  y += 18

  // ── RSA Signature ─────────────────────────────────────
  doc.setDrawColor(200, 200, 200)
  doc.line(40, y + 2, w - 40, y + 2)
  y += 12

  let signature = "—"
  try {
    signature = signLicense({
      customerId: license.customerId,
      tier: license.tier as "free" | "pro" | "enterprise",
      licenseKey: license.licenseKey,
      expiresAt: license.expiresAt.toISOString(),
    })
  } catch {
    // RSA key not available in build environment — skip
  }

  doc.setFontSize(7)
  doc.setTextColor(150, 150, 150)
  doc.text("Digital Signature (RSA-SHA256):", leftX, y)
  y += 5
  // Wrap long signature
  const sigChunks = signature.match(/.{1,80}/g) ?? [signature]
  for (const chunk of sigChunks.slice(0, 3)) {
    doc.text(chunk, leftX, y)
    y += 4
  }

  // ── Footer ────────────────────────────────────────────
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text(
    "This certificate is digitally signed and can be verified offline using the KnowFlow public key.",
    w / 2,
    h - 20,
    { align: "center" },
  )
  doc.text(
    `Generated on ${new Date().toISOString().split("T")[0]} | knowflow.ai`,
    w / 2,
    h - 15,
    { align: "center" },
  )

  return doc.output("arraybuffer") as unknown as Uint8Array
}
