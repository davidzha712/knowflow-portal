"use client"

import { useEffect, useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import { Key, Loader2, Trash2, RefreshCw } from "lucide-react"
import Link from "next/link"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface LicenseRow {
  id: string
  licenseKey: string
  tier: string
  status: string | null
  maxActivations: number | null
  activeActivations: number
  customerEmail: string | null
  customerName: string | null
  expiresAt: string | null
  createdAt: string | null
}

function statusVariant(status: string | null) {
  if (status === "active") return "secondary" as const
  if (status === "revoked") return "destructive" as const
  return "outline" as const
}

function maskKey(key: string): string {
  if (key.length <= 10) return key
  return key.slice(0, 6) + "..." + key.slice(-4)
}

export default function AdminLicensesPage() {
  const t = useTranslations("admin")
  const [licenses, setLicenses] = useState<LicenseRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    fetch("/api/admin/licenses")
      .then((r) => r.json())
      .then((res) => setLicenses(res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleRevoke = async (id: string) => {
    if (!confirm(t("revokeLicense"))) return
    await fetch(`/api/admin/licenses/${id}`, { method: "DELETE" })
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("allLicenses")}</h1>
          <p className="text-muted-foreground">{t("allLicensesDesc")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className="size-3.5" />
          </Button>
          <Button size="sm" render={<Link href="/admin/licenses/issue" />}>
            {t("issueLicense")}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : licenses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <Key className="size-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">{t("noLicenses")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">{t("licenseKey")}</th>
                <th className="px-4 py-3 text-left font-medium">{t("customer")}</th>
                <th className="px-4 py-3 text-left font-medium">{t("tier")}</th>
                <th className="px-4 py-3 text-left font-medium">{t("status")}</th>
                <th className="px-4 py-3 text-left font-medium">Activations</th>
                <th className="px-4 py-3 text-left font-medium">Expires</th>
                <th className="px-4 py-3 text-right font-medium">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((l) => (
                <tr key={l.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{maskKey(l.licenseKey)}</td>
                  <td className="px-4 py-3">{l.customerEmail ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{l.tier}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant(l.status)}>{l.status ?? "active"}</Badge>
                  </td>
                  <td className="px-4 py-3">{l.activeActivations}/{l.maxActivations ?? 1}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {l.expiresAt ? new Date(l.expiresAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {l.status !== "revoked" && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleRevoke(l.id)}
                      >
                        <Trash2 className="size-3.5 text-destructive" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
