"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type PlanKey = "free" | "pro" | "enterprise"

interface PricingCardProps {
  planKey: PlanKey
  index: number
  t: ReturnType<typeof useTranslations>
  highlighted?: boolean
}

function PricingCard({ planKey, index, t, highlighted = false }: PricingCardProps) {
  const features = t.raw(`${planKey}.features`) as string[]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={cn(
        "relative flex flex-col rounded-2xl border p-6 sm:p-8",
        highlighted
          ? "scale-[1.02] border-blue-500/50 bg-gradient-to-b from-blue-500/10 to-indigo-500/5 shadow-xl shadow-blue-500/10 lg:scale-105"
          : "border-border/50 bg-card/50"
      )}
    >
      {/* Popular badge */}
      {highlighted && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 border-blue-500/30 bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-1 text-xs text-white">
          {t("pro.popular")}
        </Badge>
      )}

      {/* Plan name */}
      <h3 className="text-lg font-semibold text-foreground">
        {t(`${planKey}.name`)}
      </h3>

      {/* Price */}
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight text-foreground">
          {t(`${planKey}.price`)}
        </span>
        {planKey === "pro" && (
          <span className="text-sm text-muted-foreground">
            {t("pro.period")}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="mt-3 text-sm text-muted-foreground">
        {t(`${planKey}.description`)}
      </p>

      {/* Feature list */}
      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <Check
              className={cn(
                "mt-0.5 size-4 shrink-0",
                highlighted ? "text-blue-400" : "text-muted-foreground"
              )}
            />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        className={cn(
          "mt-8 w-full",
          highlighted
            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-indigo-700"
            : ""
        )}
        variant={highlighted ? "default" : "outline"}
        size="lg"
      >
        {t(`${planKey}.cta`)}
      </Button>
    </motion.div>
  )
}

const plans: Array<{ key: PlanKey; highlighted: boolean }> = [
  { key: "free", highlighted: false },
  { key: "pro", highlighted: true },
  { key: "enterprise", highlighted: false },
]

export function Pricing() {
  const t = useTranslations("pricing")

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
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

        {/* Pricing cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
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
