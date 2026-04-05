"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslations } from "next-intl"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Link } from "@/i18n/navigation"
import { ThemeToggle } from "./theme-toggle"
import { LanguageSwitcher } from "./language-switcher"

const navLinks = ["features", "pricing", "docs", "contact"] as const

export function Navbar() {
  const t = useTranslations("nav")
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
    setMobileOpen(false)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
        isScrolled
          ? "border-b border-border bg-background/95 shadow-sm backdrop-blur-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary">
            <span className="text-xs font-bold text-primary-foreground">K</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            KnowFlow
          </span>
        </a>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => scrollToSection(link)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(link)}
            </button>
          ))}
        </nav>

        {/* Desktop right section */}
        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button variant="ghost" size="sm" render={<Link href="/sign-in" />}>
            {t("signIn")}
          </Button>
          <Button size="sm" render={<Link href="/dashboard" />}>
            {t("portal")}
          </Button>
        </div>

        {/* Mobile menu */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Open menu" />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>
                  <span className="text-lg font-semibold">KnowFlow</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <button
                    key={link}
                    onClick={() => scrollToSection(link)}
                    className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {t(link)}
                  </button>
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-3 px-4">
                <LanguageSwitcher />
                <Button
                  variant="outline"
                  className="w-full"
                  render={<Link href="/sign-in" />}
                >
                  {t("signIn")}
                </Button>
                <Button
                  className="w-full"
                  render={<Link href="/dashboard" />}
                >
                  {t("portal")}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
