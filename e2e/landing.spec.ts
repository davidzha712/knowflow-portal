import { test, expect } from "@playwright/test"

test.describe("Landing Page", () => {
  test("renders KnowFlow brand", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    // Brand text "KnowFlow" should appear (regardless of locale)
    const brandText = page.locator("text=KnowFlow").first()
    // If redirected to sign-in, that also has "KnowFlow"
    await expect(brandText).toBeVisible({ timeout: 10000 })
  })

  test("does NOT show Admin button", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    const adminBtn = page.locator("button:has-text('Admin'), a:has-text('Admin')")
    await expect(adminBtn).toHaveCount(0)
  })

  test("does NOT show Dashboard link in header", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    const portalLinks = page.locator('header a[href*="dashboard"]')
    await expect(portalLinks).toHaveCount(0)
  })

  test("sign-in page has no portal sidebar", async ({ page }) => {
    await page.goto("/sign-in")
    await page.waitForLoadState("networkidle")
    const sidebarTitle = page.locator("text=KnowFlow Portal")
    await expect(sidebarTitle).toHaveCount(0)
  })

  // Note: Clerk SignIn widget requires valid API keys to render form elements.
  // Auth form rendering is verified manually or in CI with Clerk test keys.
})
