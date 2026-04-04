"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "next/navigation"
import { useCallback, useTransition } from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const localeLabels: Record<string, string> = {
  en: "EN",
  zh: "ZH",
  de: "DE",
}

const locales = ["en", "zh", "de"] as const

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleSwitch = useCallback(
    (nextLocale: string) => {
      startTransition(() => {
        const segments = pathname.split("/")
        const hasLocale = locales.includes(segments[1] as typeof locales[number])
        const pathWithoutLocale = hasLocale
          ? "/" + segments.slice(2).join("/")
          : pathname
        const newPath =
          nextLocale === "en"
            ? pathWithoutLocale || "/"
            : `/${nextLocale}${pathWithoutLocale}`
        router.push(newPath)
      })
    },
    [pathname, router]
  )

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-border/50 p-0.5">
      <Globe className="ml-1.5 size-3.5 text-muted-foreground" />
      {locales.map((loc) => (
        <Button
          key={loc}
          variant="ghost"
          size="xs"
          disabled={isPending}
          onClick={() => handleSwitch(loc)}
          className={cn(
            "min-w-[2rem] text-xs font-medium",
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
