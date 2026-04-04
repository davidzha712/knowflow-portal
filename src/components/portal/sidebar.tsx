"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import {
  LayoutDashboard,
  Key,
  Shield,
  Settings,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useCallback } from "react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/licenses", label: "Licenses", icon: Key },
  { href: "/activate", label: "Activate", icon: Shield },
  { href: "/settings", label: "Settings", icon: Settings },
] as const

function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  isActive: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </Link>
  )
}

export function PortalSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = useCallback(() => {
    setMobileOpen(false)
  }, [])

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev)
  }, [])

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-50 rounded-lg bg-card p-2 ring-1 ring-border md:hidden"
        aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
      >
        {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeMobile}
          onKeyDown={(e) => {
            if (e.key === "Escape") closeMobile()
          }}
          role="button"
          tabIndex={-1}
          aria-label="Close navigation overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform duration-200 md:static md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            K
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">KnowFlow Portal</p>
            <p className="text-xs text-muted-foreground">License Management</p>
          </div>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-8",
              },
            }}
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Portal navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
              onClick={closeMobile}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            KnowFlow AI v0.1.0
          </p>
        </div>
      </aside>
    </>
  )
}
