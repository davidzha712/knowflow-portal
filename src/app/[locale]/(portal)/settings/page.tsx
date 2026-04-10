"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useTranslations } from "next-intl"
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
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Loader2, Check } from "lucide-react"

export default function SettingsPage() {
  const { user, isLoaded } = useUser()
  const t = useTranslations("portal")
  const [company, setCompany] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Load existing company from the customer record.
  useEffect(() => {
    let cancelled = false
    const loadCustomer = async () => {
      try {
        const res = await fetch("/api/customer")
        if (!res.ok) return
        const json = await res.json()
        if (!cancelled && json.success && typeof json.data?.company === "string") {
          setCompany(json.data.company)
        }
      } catch {
        // non-critical — leave field empty
      }
    }
    loadCustomer()
    return () => {
      cancelled = true
    }
  }, [])

  const handleSaveCompany = async () => {
    setSaving(true)
    try {
      await fetch("/api/customer", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // handle error
    } finally {
      setSaving(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t("settingsTitle")}
        </h1>
        <p className="text-muted-foreground">{t("settingsDesc")}</p>
      </div>

      {/* Profile settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t("profile")}</CardTitle>
          <CardDescription>{t("profileDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("firstName")}</Label>
              <Input
                value={user?.firstName ?? ""}
                disabled
                aria-label={t("firstName")}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("lastName")}</Label>
              <Input
                value={user?.lastName ?? ""}
                disabled
                aria-label={t("lastName")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("emailLabel")}</Label>
            <Input
              value={user?.primaryEmailAddress?.emailAddress ?? ""}
              disabled
              aria-label={t("emailLabel")}
            />
          </div>
          <p className="text-xs text-muted-foreground">{t("profileNote")}</p>
        </CardContent>
      </Card>

      {/* Company info */}
      <Card>
        <CardHeader>
          <CardTitle>{t("companyInfo")}</CardTitle>
          <CardDescription>{t("companyInfoDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">{t("companyName")}</Label>
            <Input
              id="company-name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={t("companyPlaceholder")}
              aria-label={t("companyName")}
            />
          </div>
          <Button onClick={handleSaveCompany} disabled={saving}>
            {saving ? (
              <Loader2 className="size-4 animate-spin mr-1.5" />
            ) : saved ? (
              <Check className="size-4 mr-1.5" />
            ) : null}
            {saved ? t("saved") : t("saveCompany")}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Billing */}
      <Card>
        <CardHeader>
          <CardTitle>{t("billing")}</CardTitle>
          <CardDescription>{t("billingDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">
            <ExternalLink className="size-4" />
            {t("openBilling")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
