"use client"

import { useLocale } from "next-intl"
import { useCallback, useTransition } from "react"
import { Globe } from "lucide-react"
import { useRouter, usePathname } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const locales = ["en", "zh", "de"] as const
const localeLabels: Record<string, string> = { en: "EN", zh: "ZH", de: "DE" }

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleSwitch = useCallback(
    (nextLocale: string) => {
      startTransition(() => {
        router.replace(pathname, { locale: nextLocale })
      })
    },
    [pathname, router]
  )

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-border p-0.5">
      <Globe className="ml-1.5 size-3.5 text-muted-foreground" />
      {locales.map((loc) => (
        <Button
          key={loc}
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() => handleSwitch(loc)}
          className={cn(
            "h-6 min-w-[2rem] px-1.5 text-xs font-medium",
            locale === loc &&
              "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
          )}
        >
          {localeLabels[loc]}
        </Button>
      ))}
    </div>
  )
}
