"use client"

import { useState, useCallback, type FormEvent } from "react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Send, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface FormState {
  name: string
  email: string
  company: string
  message: string
}

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  message: "",
}

export function ContactForm() {
  const t = useTranslations("contact")
  const [form, setForm] = useState<FormState>(initialState)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = useCallback(
    (field: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }))
      },
    []
  )

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setSubmitted(true)
    setForm(initialState)
  }, [])

  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("subtitle")}
            </p>
          </motion.div>

          {/* Right: form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl border border-border bg-card p-6 sm:p-8"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-name">{t("name")}</Label>
                <Input
                  id="contact-name"
                  required
                  value={form.name}
                  onChange={updateField("name")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">{t("email")}</Label>
                <Input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={updateField("email")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-company">{t("company")}</Label>
              <Input
                id="contact-company"
                value={form.company}
                onChange={updateField("company")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-message">{t("message")}</Label>
              <Textarea
                id="contact-message"
                rows={4}
                value={form.message}
                onChange={updateField("message")}
              />
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary"
              >
                <CheckCircle className="size-4" />
                {t("success")}
              </motion.div>
            ) : (
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full gap-2"
              >
                <Send className="size-4" />
                {isSubmitting ? "..." : t("submit")}
              </Button>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  )
}
