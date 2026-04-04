"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Monitor, Shield, Brain, Database, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"

interface ArchNodeProps {
  icon: React.ReactNode
  label: string
  description: string
  color: string
  delay: number
}

function ArchNode({ icon, label, description, color, delay }: ArchNodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center"
    >
      <div
        className={cn(
          "flex size-16 items-center justify-center rounded-2xl border sm:size-20",
          "bg-gradient-to-br shadow-lg backdrop-blur-sm",
          color
        )}
      >
        {icon}
      </div>
      <p className="mt-3 text-sm font-semibold text-foreground sm:text-base">
        {label}
      </p>
      <p className="mt-1 max-w-[140px] text-center text-xs text-muted-foreground">
        {description}
      </p>
    </motion.div>
  )
}

function ConnectionLine({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="hidden h-px w-12 origin-left bg-gradient-to-r from-blue-500/60 to-indigo-500/60 sm:block lg:w-16"
    />
  )
}

function ConnectionArrow({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className="flex items-center sm:hidden"
    >
      <div className="h-8 w-px bg-gradient-to-b from-blue-500/60 to-indigo-500/60" />
    </motion.div>
  )
}

export function Architecture() {
  const t = useTranslations("architecture")

  const nodes = [
    {
      icon: <Monitor className="size-7 text-sky-300 sm:size-8" />,
      label: "Client Apps",
      description: "Web, Mobile, API",
      color: "from-sky-500/20 to-sky-600/10 border-sky-500/30",
      delay: 0,
    },
    {
      icon: <Shield className="size-7 text-emerald-300 sm:size-8" />,
      label: "API Gateway",
      description: "Auth, Rate Limit",
      color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
      delay: 0.15,
    },
    {
      icon: <Brain className="size-7 text-blue-300 sm:size-8" />,
      label: "RAG Engine",
      description: "Retrieval & Generation",
      color: "from-blue-500/20 to-indigo-600/10 border-blue-500/30",
      delay: 0.3,
    },
  ]

  const bottomNodes = [
    {
      icon: <Database className="size-7 text-violet-300 sm:size-8" />,
      label: "Vector DB",
      description: "Embeddings Store",
      color: "from-violet-500/20 to-violet-600/10 border-violet-500/30",
      delay: 0.45,
    },
    {
      icon: <Cpu className="size-7 text-amber-300 sm:size-8" />,
      label: "LLM Layer",
      description: "Multi-Model Orchestration",
      color: "from-amber-500/20 to-amber-600/10 border-amber-500/30",
      delay: 0.55,
    },
  ]

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent dark:via-blue-950/30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

        {/* Architecture diagram */}
        <div className="mt-16 flex flex-col items-center gap-6">
          {/* Top row: Client -> Gateway -> RAG Engine */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-0">
            {nodes.map((node, i) => (
              <div key={node.label} className="flex flex-col items-center sm:flex-row">
                <ArchNode {...node} />
                {i < nodes.length - 1 && (
                  <>
                    <ConnectionLine delay={node.delay + 0.1} />
                    <ConnectionArrow delay={node.delay + 0.1} />
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Vertical connector from RAG Engine */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="h-8 w-px origin-top bg-gradient-to-b from-blue-500/60 to-indigo-500/60"
          />

          {/* Bottom row: Vector DB / LLM */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-16">
            {bottomNodes.map((node) => (
              <ArchNode key={node.label} {...node} />
            ))}
          </div>
        </div>

        {/* Decorative border */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-12 max-w-xl rounded-2xl border border-dashed border-border/50 p-4 text-center text-sm text-muted-foreground"
        >
          Horizontally scalable &middot; Auto-failover &middot; Multi-region ready
        </motion.div>
      </div>
    </section>
  )
}
