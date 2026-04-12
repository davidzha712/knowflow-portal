"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Database, Shield, Brain, Globe, Server, Award } from "lucide-react"
import type { LucideIcon } from "lucide-react"

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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-6 transition-colors hover:bg-[rgba(255,255,255,0.04)]"
    >
      <div className="flex size-9 items-center justify-center rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]">
        <Icon className="size-4 text-[#7170ff]" />
      </div>
      <h3 className="mt-4 text-[15px] font-[590] tracking-[-0.165px] text-[#f7f8f8]">
        {t(`${featureKey}.title`)}
      </h3>
      <p className="mt-2 text-[14px] font-[400] leading-[1.6] tracking-[-0.182px] text-[#8a8f98]">
        {t(`${featureKey}.description`)}
      </p>
    </motion.div>
  )
}

export function Features() {
  const t = useTranslations("features")

  return (
    <section id="features" className="bg-[#08090a] py-24 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-[32px] font-[510] leading-[1.13] tracking-[-0.704px] text-[#f7f8f8] sm:text-[48px] sm:leading-[1.0] sm:tracking-[-1.056px]">
            {t("title")}
          </h2>
          <p className="mt-4 text-[15px] font-[400] leading-[1.6] tracking-[-0.165px] text-[#8a8f98]">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
