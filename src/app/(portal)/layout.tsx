import { ClerkProvider } from "@clerk/nextjs"
import { PortalSidebar } from "@/components/portal/sidebar"

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <div className="flex min-h-screen bg-background">
        <PortalSidebar />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </ClerkProvider>
  )
}
