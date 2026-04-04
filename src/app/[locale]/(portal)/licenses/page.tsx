import { currentUser } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { Key, Download, Zap, PackageOpen } from "lucide-react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { customers } from "@/lib/db/schema"

function statusBadgeVariant(status: string, expiresAt: Date | null) {
  if (expiresAt && expiresAt < new Date()) return "outline" as const
  const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  if (expiresAt && expiresAt < thirtyDays) return "destructive" as const
  if (status === "active") return "secondary" as const
  return "outline" as const
}

function getDisplayStatus(status: string, expiresAt: Date | null): string {
  if (expiresAt && expiresAt < new Date()) return "expired"
  const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  if (expiresAt && expiresAt < thirtyDays) return "expiring"
  return status ?? "active"
}

function tierColor(tier: string): string {
  switch (tier) {
    case "enterprise":
      return "bg-violet-500/10 text-violet-400"
    case "pro":
      return "bg-blue-500/10 text-blue-400"
    case "free":
      return "bg-emerald-500/10 text-emerald-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function maskKey(key: string): string {
  if (key.length <= 8) return key
  return key.slice(0, 3) + "-XXXX-XXXX-" + key.slice(-4)
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <PackageOpen className="size-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No licenses yet</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Purchase your first KnowFlow AI license to get started with
          enterprise-grade RAG capabilities.
        </p>
        <Button className="mt-6">Purchase License</Button>
      </CardContent>
    </Card>
  )
}

export default async function LicensesPage() {
  const user = await currentUser()

  const customer = user?.id
    ? await db.query.customers.findFirst({
        where: eq(customers.clerkId, user.id),
        with: {
          licenses: {
            with: { activations: true },
          },
        },
      })
    : null

  const userLicenses = customer?.licenses ?? []

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Licenses</h1>
          <p className="text-muted-foreground">
            View and manage your KnowFlow AI license keys.
          </p>
        </div>
        <Button>Purchase License</Button>
      </div>

      {/* License list */}
      {userLicenses.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4">
          {userLicenses.map((license) => {
            const activeCount = (license.activations ?? []).filter(
              (a) => !a.revokedAt,
            ).length
            const displayStatus = getDisplayStatus(
              license.status ?? "active",
              license.expiresAt,
            )
            const tierLabel =
              license.tier.charAt(0).toUpperCase() + license.tier.slice(1)

            return (
              <Card key={license.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                        <Key className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="font-mono text-base">
                          {maskKey(license.licenseKey)}
                        </CardTitle>
                        <CardDescription>
                          Issued{" "}
                          {license.createdAt
                            ? license.createdAt.toLocaleDateString()
                            : "—"}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${tierColor(license.tier)}`}
                      >
                        {tierLabel}
                      </span>
                      <Badge
                        variant={statusBadgeVariant(
                          license.status ?? "active",
                          license.expiresAt,
                        )}
                      >
                        {displayStatus}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Activations
                      </p>
                      <p className="text-sm font-medium">
                        {activeCount} / {license.maxActivations ?? 1}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tier</p>
                      <p className="text-sm font-medium">{tierLabel}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Issued</p>
                      <p className="text-sm font-medium">
                        {license.createdAt
                          ? license.createdAt.toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Expires</p>
                      <p className="text-sm font-medium">
                        {license.expiresAt
                          ? license.expiresAt.toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Activation progress bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Activation usage</span>
                      <span>
                        {activeCount}/{license.maxActivations ?? 1}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: `${(activeCount / (license.maxActivations ?? 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href="/activate" />}
                  >
                    <Zap className="size-3.5" />
                    Activate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    render={
                      <a
                        href={`/api/licenses/${license.id}/certificate`}
                        download
                      />
                    }
                  >
                    <Download className="size-3.5" />
                    Certificate
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
