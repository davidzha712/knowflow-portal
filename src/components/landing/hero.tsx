"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { ArrowRight, Star, GitFork, Download, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const communityStats = [
  { key: "stars", value: "77.1k", icon: Star },
  { key: "forks", value: "8.7k", icon: GitFork },
  { key: "dockerPulls", value: "1.2M+", icon: Download },
  { key: "contributors", value: "200+", icon: Users },
] as const

export function Hero() {
  const t = useTranslations("hero")

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen bg-background pt-16">
      {/* Faint grid pattern */}
      <div
        className="absolute inset-0 bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.15]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pt-24 pb-20 text-center sm:px-6 sm:pt-32 lg:px-8 lg:pt-40">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="mb-6 px-3 py-1 text-xs">
            {t("badge")}
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {t("title")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button size="lg" className="gap-2 px-6" onClick={() => scrollTo("pricing")}>
            {t("cta")}
            <ArrowRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-6"
            onClick={() => scrollTo("contact")}
          >
            {t("ctaSecondary")}
          </Button>
        </motion.div>

        {/* Powered by RAGFlow + Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-20 flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg
              className="size-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <a
              href="https://github.com/infiniflow/ragflow"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
            >
              {t("poweredBy")}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
            {communityStats.map(({ key, value, icon: Icon }) => (
              <div key={key} className="flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-1.5">
                  <Icon className="size-4 text-primary" />
                  <span className="text-2xl font-bold font-mono text-foreground">
                    {value}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {t(`stats.${key}`)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
