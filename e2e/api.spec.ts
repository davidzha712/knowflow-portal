import { test, expect } from "@playwright/test"

test.describe("API Endpoints (unauthenticated)", () => {
  // API routes may return 404 (middleware locale redirect) or 401/403
  // Both are acceptable — the key is that they do NOT return 200 with data

  test("GET /api/licenses does not return data without auth", async ({ request }) => {
    const res = await request.get("/api/licenses")
    if (res.status() === 200) {
      const body = await res.json()
      expect(body.success).not.toBe(true)
    } else {
      expect(res.status()).toBeGreaterThanOrEqual(400)
    }
  })

  test("POST /api/activate rejects without auth", async ({ request }) => {
    const res = await request.post("/api/activate", {
      data: { licenseId: "test", requestCode: "test" },
    })
    expect(res.status()).toBeGreaterThanOrEqual(400)
  })

  test("GET /api/admin/stats rejects without admin", async ({ request }) => {
    const res = await request.get("/api/admin/stats")
    expect(res.status()).toBeGreaterThanOrEqual(400)
  })

  test("POST /api/admin/licenses/issue rejects without admin", async ({ request }) => {
    const res = await request.post("/api/admin/licenses/issue", {
      data: { customerId: "test", tier: "pro" },
    })
    expect(res.status()).toBeGreaterThanOrEqual(400)
  })

  test("Webhook rejects invalid signature", async ({ request }) => {
    const res = await request.post("/api/webhooks/lemon-squeezy", {
      data: { meta: { event_name: "order_created" } },
      headers: { "X-Signature": "invalid" },
    })
    expect(res.status()).toBeGreaterThanOrEqual(400)
  })
})
