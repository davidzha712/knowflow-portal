"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import {
  LayoutDashboard,
  Users,
  Key,
  FilePlus,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/licenses", label: "Licenses", icon: Key },
  { href: "/admin/licenses/issue", label: "Issue License", icon: FilePlus },
] as const

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-destructive text-destructive-foreground text-sm font-bold">
          A
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">KnowFlow Admin</p>
          <p className="text-xs text-muted-foreground">License Management</p>
        </div>
        <UserButton
          appearance={{ elements: { avatarBox: "size-8" } }}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname.endsWith("/admin")
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Back to portal */}
      <div className="border-t border-border px-3 py-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to Portal
        </Link>
      </div>
    </aside>
  )
}
