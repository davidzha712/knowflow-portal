"use client"

import { useCallback } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="size-4" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="size-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  )
}
