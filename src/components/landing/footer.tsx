"use client"

import { useTranslations } from "next-intl"

export function Footer() {
  const t = useTranslations("footer")

  const columns = [
    {
      title: t("product"),
      links: [
        { label: t("ingest"), href: "#" },
        { label: t("retrieve"), href: "#" },
        { label: t("orchestrate"), href: "#" },
        { label: t("deploy"), href: "#" },
        { label: "Pricing", href: "#pricing" },
        { label: t("security"), href: "#" },
      ],
    },
    {
      title: t("resources"),
      links: [
        { label: t("documentation"), href: "#" },
        { label: t("blog"), href: "#" },
        { label: t("changelog"), href: "#" },
        { label: t("status"), href: "#" },
        { label: t("github"), href: "https://github.com/infiniflow/ragflow" },
      ],
    },
    {
      title: t("company"),
      links: [
        { label: t("about"), href: "#" },
        { label: t("careers"), href: "#" },
        { label: t("community"), href: "#" },
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
    <footer className="border-t border-[rgba(255,255,255,0.05)] bg-[#0f1011]">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
          {/* Logo + description */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2.5">
              <div className="flex size-6 items-center justify-center rounded bg-[#5e6ad2]">
                <span className="text-[10px] font-[590] text-white">K</span>
              </div>
              <span className="text-[15px] font-[510] tracking-[-0.165px] text-[#f7f8f8]">
                KnowFlow
              </span>
            </a>
            <p className="mt-4 max-w-xs text-[13px] font-[400] leading-[1.6] tracking-[-0.13px] text-[#62666d]">
              {t("description")}
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-[12px] font-[510] uppercase tracking-[0.5px] text-[#62666d]">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13px] font-[400] tracking-[-0.13px] text-[#8a8f98] transition-colors hover:text-[#f7f8f8]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[rgba(255,255,255,0.05)] pt-8 sm:flex-row">
          <p className="text-[12px] font-[400] text-[#62666d]">
            &copy; {new Date().getFullYear()} KnowFlow AI. {t("copyright")}
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[12px] text-[#62666d] transition-colors hover:text-[#8a8f98]">{t("privacy")}</a>
            <a href="#" className="text-[12px] text-[#62666d] transition-colors hover:text-[#8a8f98]">{t("terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
