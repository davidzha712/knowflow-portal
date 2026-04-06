"use client"

import { useEffect, useState, useCallback } from "react"
import { Users, Loader2, Plus } from "lucide-react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

interface CustomerRow {
  id: string
  email: string
  name: string | null
  company: string | null
  licenseCount: number
  createdAt: string | null
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [createEmail, setCreateEmail] = useState("")
  const [createName, setCreateName] = useState("")
  const [createCompany, setCreateCompany] = useState("")
  const [creating, setCreating] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((res) => setCustomers(res.data ?? []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreate = async () => {
    if (!createEmail.trim()) return
    setCreating(true)
    try {
      const res = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: createEmail.trim(),
          name: createName.trim() || undefined,
          company: createCompany.trim() || undefined,
        }),
      })
      if (res.ok) {
        setShowCreate(false)
        setCreateEmail("")
        setCreateName("")
        setCreateCompany("")
        load()
      }
    } catch {
      // handle error
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">All registered customers.</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="size-3.5" />
          Create Customer
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : customers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <Users className="size-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">No customers yet.</p>
            <Button size="sm" className="mt-4" onClick={() => setShowCreate(true)}>
              <Plus className="size-3.5" />
              Create First Customer
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Company</th>
                <th className="px-4 py-3 text-left font-medium">Licenses</th>
                <th className="px-4 py-3 text-left font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{c.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.company ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{c.licenseCount}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Customer Sheet */}
      <Sheet open={showCreate} onOpenChange={setShowCreate}>
        <SheetContent side="right" className="w-80 sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Create Customer</SheetTitle>
            <SheetDescription>
              Add a new customer to issue licenses for.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-3 px-4">
            <div className="space-y-1.5">
              <Label htmlFor="cust-email">Email *</Label>
              <Input
                id="cust-email"
                type="email"
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
                placeholder="customer@company.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cust-name">Name</Label>
              <Input
                id="cust-name"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cust-company">Company</Label>
              <Input
                id="cust-company"
                value={createCompany}
                onChange={(e) => setCreateCompany(e.target.value)}
                placeholder="Acme Corp"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowCreate(false)} className="flex-1">
                Cancel
              </Button>
              <Button size="sm" onClick={handleCreate} disabled={creating || !createEmail.trim()} className="flex-1">
                {creating && <Loader2 className="size-3.5 animate-spin" />}
                Create
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
