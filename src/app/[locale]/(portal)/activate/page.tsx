"use client"

import { useState, useCallback, useEffect } from "react"
import { useTranslations } from "next-intl"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Shield,
  Copy,
  Check,
  Trash2,
  Monitor,
  ChevronRight,
  Loader2,
} from "lucide-react"
import { maskKey } from "@/lib/license/display"

interface LicenseOption {
  id: string
  licenseKey: string
  tier: string
  status: string | null
  maxActivations: number | null
}

interface ActivationEntry {
  id: string
  licenseKey: string
  licenseTier: string
  machineFingerprint: string
  activatedAt: string | null
}

type Step = 1 | 2 | 3

export default function ActivatePage() {
  const t = useTranslations("portal")
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [selectedLicense, setSelectedLicense] = useState("")
  const [requestCode, setRequestCode] = useState("")
  const [activationCode, setActivationCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Real data from API
  const [licenses, setLicenses] = useState<LicenseOption[]>([])
  const [activationsData, setActivationsData] = useState<ActivationEntry[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Fetch licenses and activations on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true)
      try {
        const [licRes, actRes] = await Promise.all([
          fetch("/api/licenses"),
          fetch("/api/activations"),
        ])
        if (licRes.ok) {
          const licJson = await licRes.json()
          setLicenses(
            (licJson.data ?? []).filter(
              (l: LicenseOption) => l.status === "active",
            ),
          )
        }
        if (actRes.ok) {
          const actJson = await actRes.json()
          setActivationsData(actJson.data ?? [])
        }
      } catch {
        // non-critical
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [])

  const handleGenerateActivation = useCallback(async () => {
    if (!selectedLicense || !requestCode.trim()) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseId: selectedLicense,
          requestCode: requestCode.trim(),
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? t("activationFailed"))
        return
      }
      setActivationCode(json.data.activationCode)
      setCurrentStep(3)

      // Refresh activations
      const actRes = await fetch("/api/activations")
      if (actRes.ok) {
        const actJson = await actRes.json()
        setActivationsData(actJson.data ?? [])
      }
    } catch {
      setError(t("activationNetworkError"))
    } finally {
      setLoading(false)
    }
  }, [selectedLicense, requestCode, t])

  const handleRevoke = useCallback(async (activationId: string) => {
    try {
      const res = await fetch("/api/activate", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activationId }),
      })
      if (res.ok) {
        setActivationsData((prev) => prev.filter((a) => a.id !== activationId))
      }
    } catch {
      // non-critical
    }
  }, [])

  const handleCopyActivation = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(activationCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }, [activationCode])

  const handleReset = useCallback(() => {
    setCurrentStep(1)
    setSelectedLicense("")
    setRequestCode("")
    setActivationCode("")
    setError("")
  }, [])

  const stepClasses = (step: Step) =>
    step === currentStep
      ? "border-primary bg-primary/5"
      : step < currentStep
        ? "border-primary/30 bg-primary/5 opacity-60"
        : "border-border opacity-40"

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t("licenseActivation")}
        </h1>
        <p className="text-muted-foreground">{t("licenseActivationDesc")}</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`flex size-8 items-center justify-center rounded-full text-xs font-medium ${
                step <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step}
            </div>
            <span className="hidden text-sm sm:inline">
              {step === 1 && t("step1Label")}
              {step === 2 && t("step2Label")}
              {step === 3 && t("step3Label")}
            </span>
            {step < 3 && (
              <ChevronRight className="size-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="grid gap-4">
        {/* Step 1: Select license */}
        <Card className={stepClasses(1)}>
          <CardHeader>
            <CardTitle className="text-base">{t("step1Title")}</CardTitle>
            <CardDescription>{t("step1Desc")}</CardDescription>
          </CardHeader>
          {currentStep >= 1 && (
            <CardContent className="grid gap-2">
              {loadingData ? (
                <div className="space-y-2">
                  <div className="h-14 w-full animate-pulse rounded-lg bg-muted" />
                  <div className="h-14 w-full animate-pulse rounded-lg bg-muted" />
                </div>
              ) : licenses.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  {t("noActiveLicenses")}
                </p>
              ) : (
                licenses.map((license) => (
                  <button
                    key={license.id}
                    type="button"
                    onClick={() => {
                      setSelectedLicense(license.id)
                      setCurrentStep(2)
                    }}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted ${
                      selectedLicense === license.id
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <Shield className="size-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-mono font-medium">
                        {maskKey(license.licenseKey)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {license.tier.charAt(0).toUpperCase() +
                          license.tier.slice(1)}
                      </p>
                    </div>
                    {selectedLicense === license.id && (
                      <Check className="size-4 text-primary" />
                    )}
                  </button>
                ))
              )}
            </CardContent>
          )}
        </Card>

        {/* Step 2: Paste request code */}
        <Card className={stepClasses(2)}>
          <CardHeader>
            <CardTitle className="text-base">{t("step2Title")}</CardTitle>
            <CardDescription>{t("step2Desc")}</CardDescription>
          </CardHeader>
          {currentStep >= 2 && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="request-code">{t("requestCode")}</Label>
                <Textarea
                  id="request-code"
                  placeholder={t("requestCodePlaceholder")}
                  value={requestCode}
                  onChange={(e) => setRequestCode(e.target.value)}
                  className="font-mono text-xs"
                  rows={4}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button
                onClick={handleGenerateActivation}
                disabled={!requestCode.trim() || loading}
              >
                {loading && <Loader2 className="size-4 animate-spin mr-1.5" />}
                {t("generateActivation")}
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Step 3: Activation code */}
        <Card className={stepClasses(3)}>
          <CardHeader>
            <CardTitle className="text-base">{t("step3Title")}</CardTitle>
            <CardDescription>{t("step3Desc")}</CardDescription>
          </CardHeader>
          {currentStep >= 3 && activationCode && (
            <CardContent className="space-y-4">
              <div className="relative rounded-lg bg-muted p-4">
                <pre className="overflow-x-auto text-xs font-mono break-all whitespace-pre-wrap">
                  {activationCode}
                </pre>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="absolute top-2 right-2"
                  onClick={handleCopyActivation}
                  aria-label="Copy activation code"
                >
                  {copied ? (
                    <Check className="size-3.5" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
              </div>
              <Button variant="outline" onClick={handleReset}>
                {t("activateAnother")}
              </Button>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Current activations */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t("currentActivations")}</h2>
        {loadingData ? (
          <div className="grid gap-3">
            <div className="h-16 w-full animate-pulse rounded-lg bg-muted" />
            <div className="h-16 w-full animate-pulse rounded-lg bg-muted" />
          </div>
        ) : activationsData.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {t("noActivations")}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {activationsData.map((activation) => (
              <Card key={activation.id} size="sm">
                <CardContent className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <Monitor className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium font-mono">
                      {activation.machineFingerprint.slice(0, 12)}...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {maskKey(activation.licenseKey)} &middot;{" "}
                      <Badge variant="secondary" className="text-[10px]">
                        {activation.licenseTier}
                      </Badge>{" "}
                      &middot; {t("activatedOn")}{" "}
                      {activation.activatedAt
                        ? new Date(activation.activatedAt).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRevoke(activation.id)}
                    aria-label="Revoke activation"
                  >
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
