"use client"

import { useEffect, useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import { Key, Loader2, Trash2, RefreshCw, CalendarPlus, ShieldOff, Copy, Check } from "lucide-react"
import Link from "next/link"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

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

  // Unban token state
  const [showUnban, setShowUnban] = useState(false)
  const [unbanToken, setUnbanToken] = useState("")
  const [unbanLoading, setUnbanLoading] = useState(false)
  const [unbanCopied, setUnbanCopied] = useState(false)

  const handleGenerateUnban = async () => {
    setUnbanLoading(true)
    try {
      const res = await fetch("/api/admin/unban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Admin manual unban" }),
      })
      const json = await res.json()
      if (res.ok) {
        setUnbanToken(json.unban_token)
      }
    } catch {
      // error
    } finally {
      setUnbanLoading(false)
    }
  }

  const handleCopyUnban = async () => {
    await navigator.clipboard.writeText(unbanToken)
    setUnbanCopied(true)
    setTimeout(() => setUnbanCopied(false), 2000)
  }

  const handleExtend = async (id: string) => {
    const months = prompt("Extend by how many months?", "12")
    if (!months) return
    const n = parseInt(months, 10)
    if (!n || n < 1) return
    const newExpiry = new Date()
    newExpiry.setMonth(newExpiry.getMonth() + n)
    await fetch(`/api/admin/licenses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expiresAt: newExpiry.toISOString() }),
    })
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
          <Button variant="outline" size="sm" onClick={() => { setShowUnban(true); setUnbanToken(""); }}>
            <ShieldOff className="size-3.5" />
            Unban
          </Button>
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
                    <div className="flex items-center justify-end gap-1">
                      {l.status !== "revoked" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Extend"
                            onClick={() => handleExtend(l.id)}
                          >
                            <CalendarPlus className="size-3.5 text-primary" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Revoke"
                            onClick={() => handleRevoke(l.id)}
                          >
                            <Trash2 className="size-3.5 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Unban Token Sheet */}
      <Sheet open={showUnban} onOpenChange={setShowUnban}>
        <SheetContent side="right" className="w-96 sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Generate Unban Token</SheetTitle>
            <SheetDescription>
              Generate a time-limited token to unban a customer&apos;s KnowFlow instance.
              Valid for 24 hours.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-4 px-4">
            {!unbanToken ? (
              <Button
                onClick={handleGenerateUnban}
                disabled={unbanLoading}
                className="w-full"
              >
                {unbanLoading && <Loader2 className="size-4 animate-spin" />}
                Generate Unban Token
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-[10px] text-muted-foreground mb-1 font-medium">Unban Token (send to customer):</p>
                  <code className="text-xs break-all block">{unbanToken}</code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleCopyUnban}
                >
                  {unbanCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {unbanCopied ? "Copied" : "Copy Token"}
                </Button>
                <div className="rounded-lg border p-3 text-xs text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">Instructions for customer:</p>
                  <p>1. Go to KnowFlow Admin &gt; License tab</p>
                  <p>2. Click &quot;Unban Instance&quot;</p>
                  <p>3. Paste this token and submit</p>
                  <p className="text-[10px] mt-2">Or via API: POST /api/v1/admin/system/unban</p>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
