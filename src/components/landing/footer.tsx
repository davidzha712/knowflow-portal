"use client"

import { useTranslations } from "next-intl"
import { Separator } from "@/components/ui/separator"

function FooterLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </a>
  )
}

export function Footer() {
  const t = useTranslations("footer")

  const columns = [
    {
      title: t("product"),
      links: [
        { label: t("resources"), href: "#features" },
        { label: t("changelog"), href: "#" },
      ],
    },
    {
      title: t("resources"),
      links: [
        { label: t("documentation"), href: "#" },
        { label: t("blog"), href: "#" },
      ],
    },
    {
      title: t("company"),
      links: [
        { label: t("about"), href: "#" },
        { label: t("careers"), href: "#" },
      ],
    },
    {
      title: t("legal"),
      links: [
        { label: t("privacy"), href: "#" },
        { label: t("terms"), href: "#" },
      ],
    },
  ]

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-6">
          {/* Logo + description */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-primary">
                <span className="text-xs font-bold text-primary-foreground">
                  K
                </span>
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                KnowFlow
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("description")}
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-semibold text-foreground">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} KnowFlow AI. {t("copyright")}
        </p>
      </div>
    </footer>
  )
}
