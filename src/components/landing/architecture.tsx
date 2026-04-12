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
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="flex flex-col items-center gap-2.5"
    >
      <div className="flex size-14 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] sm:size-16">
        <Icon className="size-5 text-[#7170ff]" />
      </div>
      <span className="text-[12px] font-[510] tracking-normal text-[#d0d6e0]">
        {label}
      </span>
    </motion.div>
  )
}

function Arrow({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, delay: index * 0.07 + 0.04 }}
      className="flex items-center"
    >
      {/* Horizontal on desktop */}
      <svg
        className="hidden h-4 w-8 text-[#62666d] sm:block"
        viewBox="0 0 32 16"
        fill="none"
      >
        <path
          d="M0 8h28m0 0l-4-4m4 4l-4 4"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* Vertical on mobile */}
      <svg
        className="h-8 w-4 text-[#62666d] sm:hidden"
        viewBox="0 0 16 32"
        fill="none"
      >
        <path
          d="M8 0v28m0 0l-4-4m4 4l4-4"
          stroke="currentColor"
          strokeWidth="1"
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
    <section className="bg-[#08090a] py-24 sm:py-32">
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
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex items-center justify-center gap-6"
        >
          {["Horizontally scalable", "Auto-failover", "Multi-region ready"].map(
            (label) => (
              <span
                key={label}
                className="text-[12px] font-[510] tracking-normal text-[#62666d]"
              >
                {label}
              </span>
            )
          )}
        </motion.div>
      </div>
    </section>
  )
}
