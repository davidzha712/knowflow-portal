"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { useTranslations } from "next-intl"
import {
  LayoutDashboard,
  Users,
  Key,
  FilePlus,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navKeys = [
  { href: "/admin", tKey: "dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/customers", tKey: "customers", icon: Users, exact: false },
  { href: "/admin/licenses", tKey: "allLicenses", icon: Key, exact: false },
  { href: "/admin/licenses/issue", tKey: "issueLicense", icon: FilePlus, exact: false },
] as const

export function AdminSidebar() {
  const pathname = usePathname()
  const t = useTranslations("admin")
  const tp = useTranslations("portal")

  return (
    <aside className="flex w-64 flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-destructive text-destructive-foreground text-sm font-bold">
          A
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">KnowFlow Admin</p>
          <p className="text-xs text-muted-foreground">{t("allLicensesDesc")}</p>
        </div>
        <UserButton
          appearance={{ elements: { avatarBox: "size-8" } }}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navKeys.map((item) => {
          const isActive = item.exact
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
              {t(item.tKey)}
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
          {t("backToPortal")}
        </Link>
      </div>
    </aside>
  )
}
