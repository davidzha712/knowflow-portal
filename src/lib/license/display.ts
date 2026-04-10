// Shared display helpers for license UI (dashboard, licenses page).

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

export function statusBadgeVariant(status: string, expiresAt: Date | null) {
  if (expiresAt && expiresAt < new Date()) return "outline" as const
  const thirtyDays = new Date(Date.now() + THIRTY_DAYS_MS)
  if (expiresAt && expiresAt < thirtyDays) return "destructive" as const
  if (status === "active") return "secondary" as const
  return "outline" as const
}

export function getDisplayStatus(
  status: string,
  expiresAt: Date | null,
): string {
  if (expiresAt && expiresAt < new Date()) return "expired"
  const thirtyDays = new Date(Date.now() + THIRTY_DAYS_MS)
  if (expiresAt && expiresAt < thirtyDays) return "expiring"
  return status ?? "active"
}

export function maskKey(key: string): string {
  if (key.length <= 8) return key
  return key.slice(0, 3) + "-XXXX-XXXX-" + key.slice(-4)
}
