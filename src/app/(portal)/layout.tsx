// TODO: Add Clerk auth provider in Phase 2

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r bg-muted/40 md:block">
        <nav className="flex flex-col gap-2 p-4">
          <span className="text-sm font-semibold text-muted-foreground">
            Portal Navigation
          </span>
          {/* TODO: Add sidebar links in Phase 2 */}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
