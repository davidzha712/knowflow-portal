"use client"

import { useLocale } from "next-intl"
import { useCallback, useTransition } from "react"
import { useRouter, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

const locales = ["en", "zh", "de"] as const
const localeLabels: Record<string, string> = { en: "EN", zh: "中", de: "DE" }

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleSwitch = useCallback(
    (nextLocale: string) => {
      document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=31536000`
      startTransition(() => {
        router.replace(pathname, { locale: nextLocale })
      })
    },
    [pathname, router],
  )

  return (
    <div className="flex items-center gap-0.5 rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-0.5">
      {locales.map((loc) => (
        <button
          key={loc}
          disabled={isPending}
          onClick={() => handleSwitch(loc)}
          className={cn(
            "h-6 min-w-[2rem] rounded px-1.5 text-[11px] font-[510] transition-colors",
            locale === loc
              ? "bg-[rgba(255,255,255,0.08)] text-[#f7f8f8]"
              : "text-[#62666d] hover:text-[#8a8f98]"
          )}
        >
          {localeLabels[loc]}
        </button>
      ))}
    </div>
  )
}
