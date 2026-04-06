"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Loader2, Copy, Check, Key } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface CustomerOption {
  id: string
  email: string
  name: string | null
  company: string | null
}

export default function IssueLicensePage() {
  const t = useTranslations("admin")
  const [customers, setCustomers] = useState<CustomerOption[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(true)

  // Form state
  const [customerId, setCustomerId] = useState("")
  const [tier, setTier] = useState<"pro" | "enterprise">("pro")
  const [maxActivations, setMaxActivations] = useState("3")
  const [expiryMonths, setExpiryMonths] = useState("12")
  const [activationRequest, setActivationRequest] = useState("")

  // Result state
  const [issuing, setIssuing] = useState(false)
  const [result, setResult] = useState<{
    portalKey: string
    knowflowKey: string | null
    error?: string
  } | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((res) => setCustomers(res.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingCustomers(false))
  }, [])

  const handleIssue = async () => {
    if (!customerId) return
    setIssuing(true)
    setResult(null)

    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + (parseInt(expiryMonths, 10) || 12))

    try {
      const res = await fetch("/api/admin/licenses/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          tier,
          maxActivations: parseInt(maxActivations, 10) || 1,
          expiresAt: expiresAt.toISOString(),
          activationRequest: activationRequest.trim() || undefined,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setResult({ portalKey: "", knowflowKey: null, error: json.error })
        return
      }
      setResult({
        portalKey: json.data?.licenseKey ?? "",
        knowflowKey: json.knowflowLicenseKey ?? null,
        error: json.knowflowKeyError,
      })
    } catch {
      setResult({ portalKey: "", knowflowKey: null, error: "Network error" })
    } finally {
      setIssuing(false)
    }
  }

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("issueLicense")}</h1>
        <p className="text-muted-foreground">{t("issueLicenseDesc")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("licenseDetails")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Customer selector */}
            <div className="space-y-2">
              <Label>{t("customer")}</Label>
              {loadingCustomers ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" />
                  Loading...
                </div>
              ) : (
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">{t("selectCustomer")}</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.email} {c.company ? `(${c.company})` : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Tier */}
            <div className="space-y-2">
              <Label>{t("tier")}</Label>
              <div className="flex gap-2">
                {(["pro", "enterprise"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTier(t)
                      setMaxActivations(t === "enterprise" ? "10" : "3")
                      setExpiryMonths(t === "enterprise" ? "24" : "12")
                    }}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      tier === t
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Max activations */}
            <div className="space-y-2">
              <Label htmlFor="max-act">{t("maxActivations")}</Label>
              <Input
                id="max-act"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={maxActivations}
                onChange={(e) => setMaxActivations(e.target.value.replace(/[^0-9]/g, ""))}
              />
            </div>

            {/* Expiry */}
            <div className="space-y-2">
              <Label htmlFor="expiry">{t("validityMonths")}</Label>
              <Input
                id="expiry"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={expiryMonths}
                onChange={(e) => setExpiryMonths(e.target.value.replace(/[^0-9]/g, ""))}
              />
            </div>

            {/* Activation request (optional) */}
            <div className="space-y-2">
              <Label htmlFor="act-req">
                {t("activationRequest")}
                <span className="ml-1 text-xs text-muted-foreground">({t("activationRequestOptional")})</span>
              </Label>
              <Textarea
                id="act-req"
                value={activationRequest}
                onChange={(e) => setActivationRequest(e.target.value)}
                placeholder="Paste the activation request from KnowFlow-AI admin panel..."
                className="font-mono text-xs"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {t("activationRequestHint")}
              </p>
            </div>

            <Button
              onClick={handleIssue}
              disabled={!customerId || issuing}
              className="w-full"
            >
              {issuing && <Loader2 className="size-4 animate-spin" />}
              {t("issueLicense")}
            </Button>
          </CardContent>
        </Card>

        {/* Result */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Result</CardTitle>
            <CardDescription>
              Generated license keys will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="flex flex-col items-center py-8 text-center">
                <Key className="size-10 text-muted-foreground/30" />
                <p className="mt-3 text-sm text-muted-foreground">
                  {t("resultPlaceholder")}
                </p>
              </div>
            ) : result.error && !result.portalKey ? (
              <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                {result.error}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Portal license key */}
                {result.portalKey && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">{t("portalKey")}</Label>
                      <Badge variant="secondary" className="text-[10px]">{t("dbTracking")}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded bg-muted px-3 py-2 text-xs font-mono break-all">
                        {result.portalKey}
                      </code>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => handleCopy(result.portalKey, "portal")}
                      >
                        {copied === "portal" ? (
                          <Check className="size-3.5" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* KnowFlow license key */}
                {result.knowflowKey && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">{t("knowflowKey")}</Label>
                      <Badge className="text-[10px]">{t("machineBound")}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded bg-muted px-3 py-2 text-xs font-mono break-all">
                        {result.knowflowKey}
                      </code>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => handleCopy(result.knowflowKey!, "knowflow")}
                      >
                        {copied === "knowflow" ? (
                          <Check className="size-3.5" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("sendToCustomer")}
                      <code className="mx-1 rounded bg-muted px-1">POST /api/v1/admin/system/activate</code>
                    </p>
                  </div>
                )}

                {result.error && (
                  <div className="rounded-lg bg-yellow-500/10 p-3 text-xs text-yellow-700">
                    KnowFlow key generation note: {result.error}
                  </div>
                )}

                {!result.knowflowKey && !result.error && (
                  <p className="text-xs text-muted-foreground">
                    {t("noRequestProvided")}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
