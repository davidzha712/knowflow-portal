import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-6xl font-bold tracking-tighter">404</h1>
      <p className="text-xl text-muted-foreground">Page not found</p>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  )
}
