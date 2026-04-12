"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

/**
 * Simulated KnowFlow product interface — pure CSS, no images.
 * Matches Linear's pattern of showing a realistic product mockup in the hero.
 */
function ProductMockup() {
  return (
    <div className="relative mx-auto mt-16 w-full max-w-[960px] sm:mt-20 lg:mt-24">
      {/* Outer glow */}
      <div className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-b from-[rgba(255,255,255,0.08)] to-transparent" />

      {/* Main panel */}
      <div className="overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f1011]">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.05)] px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="size-2.5 rounded-full bg-[#ff5f57]" />
            <div className="size-2.5 rounded-full bg-[#febc2e]" />
            <div className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="ml-3 text-[11px] font-[510] text-[#62666d]">
            KnowFlow — Knowledge Base
          </span>
        </div>

        <div className="flex min-h-[340px] sm:min-h-[400px]">
          {/* Sidebar */}
          <div className="hidden w-[200px] shrink-0 border-r border-[rgba(255,255,255,0.05)] bg-[#0a0b0c] p-3 sm:block">
            <div className="mb-4 flex items-center gap-2 px-2">
              <div className="flex size-5 items-center justify-center rounded bg-[#5e6ad2]">
                <span className="text-[8px] font-[590] text-white">K</span>
              </div>
              <span className="text-[12px] font-[510] text-[#d0d6e0]">Acme Corp</span>
            </div>
            {[
              { label: "Knowledge Bases", active: true },
              { label: "Documents", active: false },
              { label: "Chat", active: false },
              { label: "Analytics", active: false },
              { label: "Settings", active: false },
            ].map(({ label, active }) => (
              <div
                key={label}
                className={`mb-0.5 rounded-md px-2 py-1.5 text-[12px] font-[510] ${
                  active
                    ? "bg-[rgba(255,255,255,0.06)] text-[#f7f8f8]"
                    : "text-[#62666d]"
                }`}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Main content area */}
          <div className="flex-1 p-4 sm:p-5">
            {/* Header row */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-[590] text-[#f7f8f8]">Product Documentation</h3>
                <p className="mt-0.5 text-[11px] text-[#62666d]">1,247 documents &middot; Last synced 2m ago</p>
              </div>
              <div className="flex gap-2">
                <div className="rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-2.5 py-1 text-[11px] font-[510] text-[#8a8f98]">
                  Filter
                </div>
                <div className="rounded-md bg-[#5e6ad2] px-2.5 py-1 text-[11px] font-[510] text-white">
                  + Upload
                </div>
              </div>
            </div>

            {/* Search bar */}
            <div className="mb-4 rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-3 py-2">
              <span className="text-[13px] text-[#62666d]">Ask anything about your knowledge base...</span>
            </div>

            {/* Document list */}
            <div className="space-y-1">
              {[
                { name: "API Reference v3.2", type: "PDF", chunks: 342, status: "indexed" },
                { name: "Security Compliance Guide", type: "DOCX", chunks: 128, status: "indexed" },
                { name: "Architecture Decision Records", type: "MD", chunks: 67, status: "indexed" },
                { name: "Q1 Product Roadmap", type: "XLSX", chunks: 45, status: "processing" },
                { name: "Customer Onboarding Playbook", type: "PDF", chunks: 203, status: "indexed" },
              ].map(({ name, type, chunks, status }) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-[rgba(255,255,255,0.02)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-7 items-center justify-center rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]">
                      <span className="text-[9px] font-[590] text-[#8a8f98]">{type}</span>
                    </div>
                    <span className="text-[13px] font-[510] text-[#d0d6e0]">{name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#62666d]">{chunks} chunks</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-[510] ${
                        status === "indexed"
                          ? "bg-[rgba(39,166,68,0.12)] text-[#27a644]"
                          : "bg-[rgba(254,188,46,0.12)] text-[#febc2e]"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  const t = useTranslations("hero")

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative overflow-hidden bg-[#08090a] pt-14">
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(94,106,210,0.1),transparent)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1200px] px-4 pt-28 pb-20 sm:px-6 sm:pt-36 lg:px-8 lg:pt-44">
        {/* Headline — centered, gradient text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl text-center text-[40px] font-[510] leading-[1.0] tracking-[-0.88px] text-[#f7f8f8] sm:text-[56px] sm:tracking-[-1.232px] md:text-[64px] md:tracking-[-1.408px] lg:text-[72px] lg:tracking-[-1.584px]"
          style={{
            backgroundImage: "linear-gradient(180deg, #f7f8f8 30%, rgba(247,248,248,0.5) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            whiteSpace: "pre-line",
          }}
        >
          {t("title")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-6 max-w-xl text-center text-[16px] font-[400] leading-[1.6] text-[#8a8f98] sm:text-[18px] sm:tracking-[-0.165px]"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-10 flex justify-center gap-3"
        >
          <button
            onClick={() => scrollTo("pricing")}
            className="inline-flex items-center gap-2 rounded-md bg-[#5e6ad2] px-5 py-2.5 text-[14px] font-[510] text-white transition-colors hover:bg-[#828fff]"
          >
            {t("cta")}
            <ArrowRight className="size-4" />
          </button>
          <button
            onClick={() => scrollTo("contact")}
            className="inline-flex items-center rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-5 py-2.5 text-[14px] font-[510] text-[#d0d6e0] transition-colors hover:bg-[rgba(255,255,255,0.05)] hover:text-[#f7f8f8]"
          >
            {t("ctaSecondary")}
          </button>
        </motion.div>

        {/* Product UI Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <ProductMockup />
        </motion.div>
      </div>
    </section>
  )
}
