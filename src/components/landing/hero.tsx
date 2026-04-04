"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function FloatingOrb({
  className,
  delay = 0,
}: {
  className: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -20, 0],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  )
}

export function Hero() {
  const t = useTranslations("hero")

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950/50 to-background pt-16">
      {/* Background orbs */}
      <FloatingOrb
        className="absolute top-1/4 left-1/4 size-96 rounded-full bg-blue-500/10 blur-3xl"
        delay={0}
      />
      <FloatingOrb
        className="absolute top-1/3 right-1/4 size-80 rounded-full bg-indigo-500/10 blur-3xl"
        delay={2}
      />
      <FloatingOrb
        className="absolute bottom-1/4 left-1/3 size-72 rounded-full bg-purple-500/10 blur-3xl"
        delay={4}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pt-24 pb-20 text-center sm:px-6 sm:pt-32 lg:px-8 lg:pt-40">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="outline"
            className="mb-6 border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300"
          >
            {t("badge")}
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
            {t("title")}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg md:text-xl"
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
          <Button
            size="lg"
            className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 px-8 text-base text-white shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-indigo-700 hover:shadow-blue-500/40"
            onClick={() => scrollTo("pricing")}
          >
            {t("cta")}
            <ArrowRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 border-slate-700 bg-slate-900/50 px-8 text-base text-slate-300 hover:bg-slate-800 hover:text-white"
            onClick={() => scrollTo("contact")}
          >
            <Play className="size-4" />
            {t("ctaSecondary")}
          </Button>
        </motion.div>

        {/* Trusted by */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-sm text-slate-500"
        >
          {t("trustedBy")}
        </motion.p>

        {/* Decorative company logos placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-4 flex items-center gap-8"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-16 rounded bg-slate-800/50 sm:w-20"
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
