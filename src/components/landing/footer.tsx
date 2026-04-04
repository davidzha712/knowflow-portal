"use client"

import { useTranslations } from "next-intl"
import { Separator } from "@/components/ui/separator"

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
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
    <footer className="border-t border-border/50 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-6">
          {/* Logo + description */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <span className="text-sm font-bold text-white">K</span>
              </div>
              <span className="text-lg font-bold tracking-tight">KnowFlow</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("description")}
            </p>

            {/* Social */}
            <div className="mt-6 flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="GitHub"
              >
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
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

        <Separator className="my-8 bg-border/50" />

        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} KnowFlow AI. {t("copyright")}
        </p>
      </div>
    </footer>
  )
}
