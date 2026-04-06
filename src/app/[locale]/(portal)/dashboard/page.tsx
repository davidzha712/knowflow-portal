import { currentUser } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { Key, Shield, AlertTriangle, Plus, Zap } from "lucide-react"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { customers } from "@/lib/db/schema"

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="flex items-center justify-between text-2xl">
          {value}
          <Icon className="size-5 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
    </Card>
  )
}

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

function maskKey(key: string): string {
  if (key.length <= 8) return key
  return key.slice(0, 3) + "-XXXX-XXXX-" + key.slice(-4)
}

export default async function DashboardPage() {
  const user = await currentUser()
  const t = await getTranslations("portal")
  const displayName = user?.firstName ?? user?.username ?? ""

  const customer = user?.id
    ? await db.query.customers.findFirst({
        where: eq(customers.clerkId, user.id),
        with: { licenses: { with: { activations: true } } },
      })
    : null

  const userLicenses = customer?.licenses ?? []
  const totalLicenses = userLicenses.length
  const activeActivationCount = userLicenses.reduce((sum, lic) => {
    return sum + (lic.activations ?? []).filter((a) => !a.revokedAt).length
  }, 0)
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  const expiringSoon = userLicenses.filter(
    (lic) => lic.status === "active" && lic.expiresAt && lic.expiresAt < thirtyDaysFromNow && lic.expiresAt > new Date(),
  ).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t("welcome", { name: displayName })}
        </h1>
        <p className="text-muted-foreground">{t("manageDesc")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title={t("totalLicenses")} value={totalLicenses} icon={Key} />
        <StatCard title={t("activeActivations")} value={activeActivationCount} icon={Shield} />
        <StatCard title={t("expiringSoon")} value={expiringSoon} icon={AlertTriangle} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button render={<Link href="/licenses" />}>
          <Plus className="size-4" />
          {t("purchaseLicense")}
        </Button>
        <Button variant="outline" render={<Link href="/activate" />}>
          <Zap className="size-4" />
          {t("activateLicense")}
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t("recentLicenses")}</h2>
        {userLicenses.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">{t("noLicenses")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {userLicenses.slice(0, 5).map((license) => {
              const activeCount = (license.activations ?? []).filter((a) => !a.revokedAt).length
              const displayStatus = getDisplayStatus(license.status ?? "active", license.expiresAt)
              return (
                <Card key={license.id} size="sm">
                  <CardContent className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <Key className="size-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium font-mono truncate">{maskKey(license.licenseKey)}</p>
                        <Badge variant={statusBadgeVariant(license.status ?? "active", license.expiresAt)}>
                          {displayStatus}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {license.tier.charAt(0).toUpperCase() + license.tier.slice(1)} &middot; {activeCount}/{license.maxActivations ?? 1} {t("activations")} &middot; {t("expires")} {license.expiresAt?.toLocaleDateString() ?? "N/A"}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" render={<Link href="/licenses" />}>View</Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
