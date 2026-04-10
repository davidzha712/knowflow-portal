"use client"

import { useState, useCallback } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PurchaseButtonProps {
  tier: "pro" | "enterprise"
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline"
}

// Kicks off a Lemon Squeezy hosted checkout session via POST /api/checkout.
// On success, the browser is redirected to the checkout URL.
export function PurchaseButton({
  tier,
  children,
  className,
  variant = "default",
}: PurchaseButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          redirectUrl: `${window.location.origin}/dashboard`,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.url) {
        throw new Error(json.error ?? "Failed to start checkout")
      }
      window.location.href = json.url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed")
      setLoading(false)
    }
  }, [tier])

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <Button
        type="button"
        variant={variant}
        className={className}
        onClick={handleClick}
        disabled={loading}
      >
        {loading && <Loader2 className="size-4 animate-spin mr-1.5" />}
        {children}
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  )
}
