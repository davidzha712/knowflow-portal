"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
      {/* Top fade */}
      <div
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent"
        aria-hidden="true"
      />
      {/* Bottom fade */}
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

        {/* Trusted by */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-20 text-xs uppercase tracking-wider text-muted-foreground"
        >
          {t("trustedBy")}
        </motion.p>

        {/* Logo placeholders */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 flex items-center gap-8"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-5 w-16 rounded bg-muted sm:w-20"
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
