import { currentUser } from "@clerk/nextjs/server"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

/**
 * Check if the current Clerk user is an admin.
 * Returns the user object if admin, null otherwise.
 */
export async function requireAdmin() {
  const user = await currentUser()
  if (!user) return null

  const email = user.primaryEmailAddress?.emailAddress?.toLowerCase()
  if (!email || !ADMIN_EMAILS.includes(email)) return null

  return user
}

/**
 * Check admin status without throwing.
 */
export async function isAdmin(): Promise<boolean> {
  const user = await currentUser()
  if (!user) return false

  const email = user.primaryEmailAddress?.emailAddress?.toLowerCase()
  return Boolean(email && ADMIN_EMAILS.includes(email))
}
