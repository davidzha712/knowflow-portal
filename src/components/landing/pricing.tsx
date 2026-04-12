"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type PlanKey = "free" | "pro" | "enterprise"

interface PlanConfig {
  key: PlanKey
  highlighted: boolean
}

const plans: PlanConfig[] = [
  { key: "free", highlighted: false },
  { key: "pro", highlighted: true },
  { key: "enterprise", highlighted: false },
]

function PricingCard({
  planKey,
  index,
  t,
  highlighted = false,
}: {
  planKey: PlanKey
  index: number
  t: ReturnType<typeof useTranslations>
  highlighted?: boolean
}) {
  const features = t.raw(`${planKey}.features`) as string[]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={cn(
        "relative flex flex-col rounded-xl border p-6 sm:p-8",
        highlighted
          ? "border-[#5e6ad2] bg-[rgba(94,106,210,0.04)]"
          : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]"
      )}
    >
      {/* Popular badge */}
      {highlighted && (
        <div className="absolute -top-3 left-6">
          <span className="inline-flex rounded-full bg-[#5e6ad2] px-3 py-0.5 text-[11px] font-[510] text-white">
            {t("pro.popular")}
          </span>
        </div>
      )}

      {/* Plan name */}
      <h3 className="text-[14px] font-[510] tracking-[-0.182px] text-[#8a8f98]">
        {t(`${planKey}.name`)}
      </h3>

      {/* Price */}
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-mono text-[36px] font-[510] tracking-[-0.8px] text-[#f7f8f8]">
          {t(`${planKey}.price`)}
        </span>
        {planKey === "pro" && (
          <span className="text-[14px] font-[400] text-[#62666d]">
            {t("pro.period")}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="mt-2 text-[14px] font-[400] leading-[1.5] text-[#8a8f98]">
        {t(`${planKey}.description`)}
      </p>

      {/* Divider */}
      <div className="my-6 h-px bg-[rgba(255,255,255,0.05)]" />

      {/* Feature list */}
      <ul className="flex flex-1 flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check className="mt-0.5 size-4 shrink-0 text-[#5e6ad2]" />
            <span className="text-[14px] font-[400] leading-[1.5] tracking-[-0.182px] text-[#d0d6e0]">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        className={cn(
          "mt-8 w-full rounded-md py-2.5 text-[14px] font-[510] transition-colors",
          highlighted
            ? "bg-[#5e6ad2] text-white hover:bg-[#828fff]"
            : "border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#f7f8f8]"
        )}
      >
        {t(`${planKey}.cta`)}
      </button>
    </motion.div>
  )
}

export function Pricing() {
  const t = useTranslations("pricing")

  return (
    <section id="pricing" className="bg-[#08090a] py-24 sm:py-32">
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

        {/* Pricing cards */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.key}
              planKey={plan.key}
              index={index}
              t={t}
              highlighted={plan.highlighted}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
