"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card
        className={cn(
          "relative h-full",
          highlighted && "border-primary ring-1 ring-primary"
        )}
      >
        {/* Popular badge */}
        {highlighted && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge>{t("pro.popular")}</Badge>
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-base">{t(`${planKey}.name`)}</CardTitle>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="font-mono text-4xl font-bold tracking-tight text-foreground">
              {t(`${planKey}.price`)}
            </span>
            {planKey === "pro" && (
              <span className="text-sm text-muted-foreground">
                {t("pro.period")}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {t(`${planKey}.description`)}
          </p>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col">
          {/* Feature list */}
          <ul className="flex flex-1 flex-col gap-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Button
            className="mt-8 w-full"
            variant={highlighted ? "default" : "outline"}
            size="lg"
          >
            {t(`${planKey}.cta`)}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function Pricing() {
  const t = useTranslations("pricing")

  return (
    <section id="pricing" className="py-24 sm:py-32">
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
