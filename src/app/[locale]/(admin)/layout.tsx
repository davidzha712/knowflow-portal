import { ClerkProvider } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth/admin"
import { AdminSidebar } from "@/components/admin/sidebar"

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const admin = await requireAdmin()
  if (!admin) {
    redirect("/dashboard")
  }

  return (
    <ClerkProvider>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </ClerkProvider>
  )
}
