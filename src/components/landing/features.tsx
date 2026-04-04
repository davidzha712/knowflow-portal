"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Database, Shield, Brain, Globe, Server, Award } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  icon: LucideIcon
  titleKey: string
  descriptionKey: string
  index: number
  t: ReturnType<typeof useTranslations>
}

const features: Array<{
  icon: LucideIcon
  key: string
}> = [
  { icon: Database, key: "coreRag" },
  { icon: Shield, key: "enterprise" },
  { icon: Brain, key: "ai" },
  { icon: Globe, key: "dataSources" },
  { icon: Server, key: "deployment" },
  { icon: Award, key: "commercial" },
]

function FeatureCard({ icon: Icon, titleKey, descriptionKey, index, t }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={cn(
        "group relative rounded-2xl border border-border/50 bg-card/50 p-6",
        "backdrop-blur-sm transition-shadow duration-300",
        "hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5"
      )}
    >
      {/* Gradient hover overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 ring-1 ring-blue-500/20">
          <Icon className="size-6 text-blue-400" />
        </div>

        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {t(titleKey)}
        </h3>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {t(descriptionKey)}
        </p>
      </div>
    </motion.div>
  )
}

export function Features() {
  const t = useTranslations("features")

  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.key}
              icon={feature.icon}
              titleKey={`${feature.key}.title`}
              descriptionKey={`${feature.key}.description`}
              index={index}
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
