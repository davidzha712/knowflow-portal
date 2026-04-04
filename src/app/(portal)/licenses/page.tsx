import { Key, Download, Zap, Eye, PackageOpen } from "lucide-react"
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

// TODO: Replace with real data from database once Drizzle ORM is connected
const PLACEHOLDER_LICENSES = [
  {
    id: "lic_1",
    key: "KF-A1B2-C3D4-E5F6-G7H8",
    maskedKey: "KF-XXXX-XXXX-XXXX-G7H8",
    tier: "Enterprise",
    status: "active" as const,
    activations: 5,
    maxActivations: 10,
    issuedAt: "2026-01-15",
    expiresAt: "2027-01-15",
  },
  {
    id: "lic_2",
    key: "KF-I9J0-K1L2-M3N4-O5P6",
    maskedKey: "KF-XXXX-XXXX-XXXX-O5P6",
    tier: "Professional",
    status: "active" as const,
    activations: 2,
    maxActivations: 3,
    issuedAt: "2026-02-01",
    expiresAt: "2026-06-30",
  },
  {
    id: "lic_3",
    key: "KF-Q7R8-S9T0-U1V2-W3X4",
    maskedKey: "KF-XXXX-XXXX-XXXX-W3X4",
    tier: "Starter",
    status: "expiring" as const,
    activations: 0,
    maxActivations: 1,
    issuedAt: "2025-04-30",
    expiresAt: "2026-04-30",
  },
] as const

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

function tierColor(tier: string): string {
  switch (tier) {
    case "Enterprise":
      return "bg-violet-500/10 text-violet-400"
    case "Professional":
      return "bg-blue-500/10 text-blue-400"
    case "Starter":
      return "bg-emerald-500/10 text-emerald-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <PackageOpen className="size-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No licenses yet</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Purchase your first KnowFlow AI license to get started with
          enterprise-grade RAG capabilities.
        </p>
        <Button className="mt-6">Purchase License</Button>
      </CardContent>
    </Card>
  )
}

export default function LicensesPage() {
  // TODO: Fetch licenses from database
  const licenses: ReadonlyArray<{
    id: string
    key: string
    maskedKey: string
    tier: string
    status: string
    activations: number
    maxActivations: number
    issuedAt: string
    expiresAt: string
  }> = PLACEHOLDER_LICENSES

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Licenses</h1>
          <p className="text-muted-foreground">
            View and manage your KnowFlow AI license keys.
          </p>
        </div>
        <Button>Purchase License</Button>
      </div>

      {/* License list */}
      {licenses.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4">
          {licenses.map((license) => (
            <Card key={license.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <Key className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="font-mono text-base">
                        {license.maskedKey}
                      </CardTitle>
                      <CardDescription>
                        Issued {license.issuedAt}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${tierColor(license.tier)}`}
                    >
                      {license.tier}
                    </span>
                    <Badge variant={statusBadgeVariant(license.status)}>
                      {license.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Activations</p>
                    <p className="text-sm font-medium">
                      {license.activations} / {license.maxActivations}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tier</p>
                    <p className="text-sm font-medium">{license.tier}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Issued</p>
                    <p className="text-sm font-medium">{license.issuedAt}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Expires</p>
                    <p className="text-sm font-medium">{license.expiresAt}</p>
                  </div>
                </div>

                {/* Activation progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Activation usage</span>
                    <span>
                      {license.activations}/{license.maxActivations}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${(license.activations / license.maxActivations) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="size-3.5" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Zap className="size-3.5" />
                  Activate
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="size-3.5" />
                  Certificate
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
