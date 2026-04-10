import { currentUser } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { Key, Download, Zap, PackageOpen } from "lucide-react"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
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
import {
  statusBadgeVariant,
  getDisplayStatus,
  maskKey,
} from "@/lib/license/display"

export default async function LicensesPage() {
  const user = await currentUser()
  const t = await getTranslations("portal")

  const customer = user?.id
    ? await db.query.customers.findFirst({
        where: eq(customers.clerkId, user.id),
        with: { licenses: { with: { activations: true } } },
      })
    : null

  const userLicenses = customer?.licenses ?? []

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("myLicenses")}</h1>
          <p className="text-muted-foreground">{t("myLicensesDesc")}</p>
        </div>
        <Button>{t("purchaseLicense")}</Button>
      </div>

      {userLicenses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <PackageOpen className="size-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{t("noLicenses")}</h3>
            <Button className="mt-6">{t("purchaseLicense")}</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {userLicenses.map((license) => {
            const activeCount = (license.activations ?? []).filter((a) => !a.revokedAt).length
            const displayStatus = getDisplayStatus(license.status ?? "active", license.expiresAt)
            const tierLabel = license.tier.charAt(0).toUpperCase() + license.tier.slice(1)

            return (
              <Card key={license.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                        <Key className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="font-mono text-base">{maskKey(license.licenseKey)}</CardTitle>
                        <CardDescription>{t("issued")} {license.createdAt?.toLocaleDateString() ?? "—"}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={statusBadgeVariant(license.status ?? "active", license.expiresAt)}>
                      {displayStatus}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{t("activations")}</p>
                      <p className="text-sm font-medium">{activeCount} / {license.maxActivations ?? 1}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t("issued")}</p>
                      <p className="text-sm font-medium">{license.createdAt?.toLocaleDateString() ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t("expires")}</p>
                      <p className="text-sm font-medium">{license.expiresAt?.toLocaleDateString() ?? "—"}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{t("activationUsage")}</span>
                      <span>{activeCount}/{license.maxActivations ?? 1}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(activeCount / (license.maxActivations ?? 1)) * 100}%` }} />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="gap-2">
                  <Button variant="outline" size="sm" render={<Link href="/activate" />}>
                    <Zap className="size-3.5" />
                    {t("activate")}
                  </Button>
                  <Button variant="outline" size="sm" render={<a href={`/api/licenses/${license.id}/certificate`} download />}>
                    <Download className="size-3.5" />
                    {t("certificate")}
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
