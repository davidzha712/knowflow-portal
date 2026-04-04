import { currentUser } from "@clerk/nextjs/server"
import { Key, Shield, AlertTriangle, Plus, Zap } from "lucide-react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// TODO: Replace with real data from database once Drizzle ORM is connected
const PLACEHOLDER_STATS = {
  totalLicenses: 3,
  activeActivations: 7,
  expiringSoon: 1,
} as const

const PLACEHOLDER_LICENSES = [
  {
    id: "lic_1",
    key: "KF-XXXX-XXXX-A1B2",
    tier: "Enterprise",
    status: "active" as const,
    activations: 5,
    maxActivations: 10,
    expiresAt: "2027-01-15",
  },
  {
    id: "lic_2",
    key: "KF-XXXX-XXXX-C3D4",
    tier: "Professional",
    status: "active" as const,
    activations: 2,
    maxActivations: 3,
    expiresAt: "2026-06-30",
  },
  {
    id: "lic_3",
    key: "KF-XXXX-XXXX-E5F6",
    tier: "Starter",
    status: "expiring" as const,
    activations: 0,
    maxActivations: 1,
    expiresAt: "2026-04-30",
  },
] as const

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  description: string
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
      <CardContent>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function statusBadgeVariant(status: string) {
  switch (status) {
    case "active":
      return "secondary" as const
    case "expiring":
      return "destructive" as const
    case "expired":
      return "outline" as const
    default:
      return "outline" as const
  }
}

export default async function DashboardPage() {
  const user = await currentUser()
  const displayName = user?.firstName ?? user?.username ?? "there"

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {displayName}
        </h1>
        <p className="text-muted-foreground">
          Manage your KnowFlow AI licenses and activations.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Licenses"
          value={PLACEHOLDER_STATS.totalLicenses}
          icon={Key}
          description="Across all tiers"
        />
        <StatCard
          title="Active Activations"
          value={PLACEHOLDER_STATS.activeActivations}
          icon={Shield}
          description="Machines currently activated"
        />
        <StatCard
          title="Expiring Soon"
          value={PLACEHOLDER_STATS.expiringSoon}
          icon={AlertTriangle}
          description="Within the next 30 days"
        />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Button render={<Link href="/licenses" />}>
          <Plus className="size-4" />
          Purchase License
        </Button>
        <Button variant="outline" render={<Link href="/activate" />}>
          <Zap className="size-4" />
          Activate License
        </Button>
      </div>

      {/* Recent licenses */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Recent Licenses</h2>
        <div className="grid gap-3">
          {PLACEHOLDER_LICENSES.map((license) => (
            <Card key={license.id} size="sm">
              <CardContent className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Key className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium font-mono truncate">
                      {license.key}
                    </p>
                    <Badge variant={statusBadgeVariant(license.status)}>
                      {license.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {license.tier} &middot; {license.activations}/
                    {license.maxActivations} activations &middot; Expires{" "}
                    {license.expiresAt}
                  </p>
                </div>
                <Button variant="ghost" size="sm" render={<Link href="/licenses" />}>
                  View
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
