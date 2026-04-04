"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import {
  FileText,
  Cog,
  Database,
  Brain,
  Cpu,
  MessageSquare,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface ArchNode {
  icon: LucideIcon
  label: string
}

const pipelineNodes: ArchNode[] = [
  { icon: FileText, label: "Document Sources" },
  { icon: Cog, label: "Parsing Engine" },
  { icon: Database, label: "Vector Store" },
  { icon: Brain, label: "RAG Engine" },
  { icon: Cpu, label: "LLM" },
  { icon: MessageSquare, label: "Response" },
]

function NodeBox({
  icon: Icon,
  label,
  index,
}: ArchNode & { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="flex flex-col items-center gap-2"
    >
      <div className="flex size-14 items-center justify-center rounded-xl border border-border bg-card sm:size-16">
        <Icon className="size-5 text-primary" />
      </div>
      <span className="text-xs font-medium text-foreground">{label}</span>
    </motion.div>
  )
}

function Arrow({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.08 + 0.04 }}
      className="flex items-center"
    >
      {/* Horizontal on desktop */}
      <svg
        className="hidden h-4 w-8 text-muted-foreground sm:block"
        viewBox="0 0 32 16"
        fill="none"
      >
        <path
          d="M0 8h28m0 0l-4-4m4 4l-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* Vertical on mobile */}
      <svg
        className="h-8 w-4 text-muted-foreground sm:hidden"
        viewBox="0 0 16 32"
        fill="none"
      >
        <path
          d="M8 0v28m0 0l-4-4m4 4l4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  )
}

export function Architecture() {
  const t = useTranslations("architecture")

  return (
    <section className="py-24 sm:py-32">
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

        {/* Pipeline diagram */}
        <div className="mt-16 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-3">
          {pipelineNodes.map((node, i) => (
            <div
              key={node.label}
              className="flex flex-col items-center sm:flex-row sm:gap-3"
            >
              <NodeBox {...node} index={i} />
              {i < pipelineNodes.length - 1 && <Arrow index={i} />}
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center text-xs text-muted-foreground"
        >
          Horizontally scalable &middot; Auto-failover &middot; Multi-region
          ready
        </motion.p>
      </div>
    </section>
  )
}
