"use client"

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
import { ExternalLink } from "lucide-react"

export default function SettingsPage() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Loading...</p>
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
          {/* TODO: Connect to database for company info persistence */}
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              placeholder="Acme Corp"
              aria-label="Company name"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company-website">Website</Label>
              <Input
                id="company-website"
                placeholder="https://example.com"
                aria-label="Company website"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-id">Tax ID / VAT Number</Label>
              <Input
                id="tax-id"
                placeholder="XX-XXXXXXX"
                aria-label="Tax ID or VAT number"
              />
            </div>
          </div>
          <Button>Save Company Info</Button>
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
          {/* TODO: Integrate with Lemon Squeezy billing portal */}
          <Button variant="outline">
            <ExternalLink className="size-4" />
            Open Billing Portal
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
