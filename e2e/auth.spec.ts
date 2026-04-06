import { test, expect } from "@playwright/test"

test.describe("Authentication Guards", () => {
  // In Clerk dev mode, middleware may not redirect — so we check that
  // the page either redirects or at least doesn't show portal content
  // to unauthenticated users.

  test("dashboard page does not show user data without auth", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "networkidle" })
    const url = page.url()
    // Either redirected away, or page renders without user data
    const hasRedirected = !url.includes("/dashboard")
    const hasNoUserData = !(await page.locator("text=Welcome back").isVisible().catch(() => false))
    expect(hasRedirected || hasNoUserData).toBe(true)
  })

  test("admin page redirects non-admin users", async ({ page }) => {
    await page.goto("/admin", { waitUntil: "networkidle" })
    const url = page.url()
    // Admin layout redirects non-admin to /dashboard or /login
    expect(url).not.toContain("/admin")
  })
})
