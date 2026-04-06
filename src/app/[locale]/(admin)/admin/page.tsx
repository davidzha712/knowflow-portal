"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Users, Key, Shield, Loader2 } from "lucide-react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Stats {
  customers: number
  licenses: number
  activeActivations: number
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string
  value: number | null
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="flex items-center justify-between text-3xl">
          {value === null ? (
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          ) : (
            value
          )}
          <Icon className="size-5 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
    </Card>
  )
}

export default function AdminDashboardPage() {
  const t = useTranslations("admin")
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(setStats)
      .catch(() => setStats({ customers: 0, licenses: 0, activeActivations: 0 }))
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("dashboard")}</h1>
        <p className="text-muted-foreground">{t("dashboardDesc")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title={t("customers")} value={stats?.customers ?? null} icon={Users} />
        <StatCard title={t("allLicenses")} value={stats?.licenses ?? null} icon={Key} />
        <StatCard title="Active" value={stats?.activeActivations ?? null} icon={Shield} />
      </div>

      <div className="flex gap-3">
        <Button render={<Link href="/admin/licenses/issue" />}>
          {t("issueLicense")}
        </Button>
        <Button variant="outline" render={<Link href="/admin/customers" />}>
          {t("customers")}
        </Button>
        <Button variant="outline" render={<Link href="/admin/licenses" />}>
          {t("allLicenses")}
        </Button>
      </div>
    </div>
  )
}
