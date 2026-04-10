"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
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
  const [company, setCompany] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

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
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and organization preferences.
        </p>
      </div>

      {/* Profile settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Your personal information. Email and authentication are managed
            through Clerk.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                value={user?.firstName ?? ""}
                disabled
                aria-label="First name"
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                value={user?.lastName ?? ""}
                disabled
                aria-label="Last name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={user?.primaryEmailAddress?.emailAddress ?? ""}
              disabled
              aria-label="Email address"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Profile information is managed through your Clerk account. Click the
            avatar in the sidebar to update your profile.
          </p>
        </CardContent>
      </Card>

      {/* Company info */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Organization details for license invoicing and certificates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Corp"
              aria-label="Company name"
            />
          </div>
          <Button onClick={handleSaveCompany} disabled={saving}>
            {saving ? (
              <Loader2 className="size-4 animate-spin mr-1.5" />
            ) : saved ? (
              <Check className="size-4 mr-1.5" />
            ) : null}
            {saved ? "Saved" : "Save Company Info"}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Billing */}
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>
            View your billing history and manage payment methods.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">
            <ExternalLink className="size-4" />
            Open Billing Portal
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
