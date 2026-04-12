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
          ? "border-b border-[rgba(255,255,255,0.05)] bg-[#0f1011]/95 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex size-6 items-center justify-center rounded bg-[#5e6ad2]">
            <span className="text-[10px] font-[590] text-white">K</span>
          </div>
          <span className="text-[15px] font-[510] tracking-[-0.165px] text-[#f7f8f8]">
            KnowFlow
          </span>
        </a>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-0.5 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => scrollToSection(link)}
              className="rounded-md px-3 py-1.5 text-[13px] font-[510] tracking-[-0.13px] text-[#d0d6e0] transition-colors hover:text-[#f7f8f8]"
            >
              {t(link)}
            </button>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-md bg-[rgba(255,255,255,0.02)] px-3 text-[13px] font-[510] text-[#d0d6e0] border border-[rgba(255,255,255,0.08)] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.04)]"
            render={<Link href="/sign-in" />}
          >
            {t("signIn")}
          </Button>
          <Button
            size="sm"
            className="h-8 rounded-md bg-[#5e6ad2] px-4 text-[13px] font-[510] text-white hover:bg-[#828fff]"
            onClick={() => scrollToSection("pricing")}
          >
            {t("getStarted")}
          </Button>
        </div>

        {/* Mobile menu */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="text-[#d0d6e0] hover:text-[#f7f8f8]"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-[rgba(255,255,255,0.05)] bg-[#0f1011]">
              <SheetHeader>
                <SheetTitle>
                  <span className="text-[15px] font-[510] text-[#f7f8f8]">KnowFlow</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-0.5 px-4">
                {navLinks.map((link) => (
                  <button
                    key={link}
                    onClick={() => scrollToSection(link)}
                    className="rounded-md px-3 py-2.5 text-left text-[14px] font-[510] text-[#d0d6e0] transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-[#f7f8f8]"
                  >
                    {t(link)}
                  </button>
                ))}
              </nav>
              <div className="mt-6 flex flex-col gap-3 px-4">
                <LanguageSwitcher />
                <Button
                  variant="outline"
                  className="w-full border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-[#d0d6e0]"
                  render={<Link href="/sign-in" />}
                >
                  {t("signIn")}
                </Button>
                <Button
                  className="w-full bg-[#5e6ad2] text-white hover:bg-[#828fff]"
                  onClick={() => scrollToSection("pricing")}
                >
                  {t("getStarted")}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
