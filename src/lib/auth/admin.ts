import { currentUser } from "@clerk/nextjs/server"

/**
 * Read admin emails at call time (not module load time) so env vars
 * that are injected after cold start are picked up correctly.
 */
function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * Check if the current Clerk user is an admin.
 * Returns the user object if admin, null otherwise.
 */
export async function requireAdmin() {
  const user = await currentUser()
  if (!user) return null

  const email = user.primaryEmailAddress?.emailAddress?.toLowerCase()
  const adminEmails = getAdminEmails()
  if (!email || !adminEmails.includes(email)) return null

  return user
}

/**
 * Check admin status without throwing.
 */
export async function isAdmin(): Promise<boolean> {
  const user = await currentUser()
  if (!user) return false

  const email = user.primaryEmailAddress?.emailAddress?.toLowerCase()
  const adminEmails = getAdminEmails()
  return Boolean(email && adminEmails.includes(email))
}
