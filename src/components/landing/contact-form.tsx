"use client"

import { useState, useCallback, type FormEvent } from "react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Send, CheckCircle } from "lucide-react"

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

function FormField({
  id,
  label,
  type = "text",
  required = false,
  value,
  onChange,
}: {
  id: string
  label: string
  type?: string
  required?: boolean
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-[13px] font-[510] tracking-[-0.13px] text-[#d0d6e0]"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-3.5 py-2.5 text-[15px] font-[400] text-[#f7f8f8] placeholder:text-[#62666d] outline-none transition-colors focus:border-[#5e6ad2]"
      />
    </div>
  )
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
    <section id="contact" className="bg-[#08090a] py-24 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-[32px] font-[510] leading-[1.13] tracking-[-0.704px] text-[#f7f8f8] sm:text-[48px] sm:leading-[1.0] sm:tracking-[-1.056px]">
              {t("title")}
            </h2>
            <p className="mt-4 text-[15px] font-[400] leading-[1.6] tracking-[-0.165px] text-[#8a8f98]">
              {t("subtitle")}
            </p>
          </motion.div>

          {/* Right: form */}
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-6 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                id="contact-name"
                label={t("name")}
                required
                value={form.name}
                onChange={updateField("name")}
              />
              <FormField
                id="contact-email"
                label={t("email")}
                type="email"
                required
                value={form.email}
                onChange={updateField("email")}
              />
            </div>

            <FormField
              id="contact-company"
              label={t("company")}
              value={form.company}
              onChange={updateField("company")}
            />

            <div className="space-y-2">
              <label
                htmlFor="contact-message"
                className="text-[13px] font-[510] tracking-[-0.13px] text-[#d0d6e0]"
              >
                {t("message")}
              </label>
              <textarea
                id="contact-message"
                rows={4}
                value={form.message}
                onChange={updateField("message")}
                className="w-full rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-3.5 py-2.5 text-[15px] font-[400] text-[#f7f8f8] placeholder:text-[#62666d] outline-none transition-colors focus:border-[#5e6ad2]"
              />
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 rounded-md border border-[rgba(94,106,210,0.2)] bg-[rgba(94,106,210,0.06)] px-4 py-3 text-[14px] font-[510] text-[#7170ff]"
              >
                <CheckCircle className="size-4" />
                {t("success")}
              </motion.div>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[#5e6ad2] py-2.5 text-[14px] font-[510] text-white transition-colors hover:bg-[#828fff] disabled:opacity-50"
              >
                <Send className="size-4" />
                {isSubmitting ? "..." : t("submit")}
              </button>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  )
}
