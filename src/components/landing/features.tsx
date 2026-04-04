"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Database, Shield, Brain, Globe, Server, Award } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features: Array<{ icon: LucideIcon; key: string }> = [
  { icon: Database, key: "coreRag" },
  { icon: Shield, key: "enterprise" },
  { icon: Brain, key: "ai" },
  { icon: Globe, key: "dataSources" },
  { icon: Server, key: "deployment" },
  { icon: Award, key: "commercial" },
]

function FeatureCard({
  icon: Icon,
  featureKey,
  index,
  t,
}: {
  icon: LucideIcon
  featureKey: string
  index: number
  t: ReturnType<typeof useTranslations>
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card className="h-full transition-colors hover:border-primary/50">
        <CardContent className="pt-2">
          <Icon className="size-5 text-primary" />
          <h3 className="mt-4 text-sm font-semibold text-foreground">
            {t(`${featureKey}.title`)}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {t(`${featureKey}.description`)}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function Features() {
  const t = useTranslations("features")

  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.key}
              icon={feature.icon}
              featureKey={feature.key}
              index={index}
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
