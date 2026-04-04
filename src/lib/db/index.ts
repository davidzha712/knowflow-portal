import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "./schema";

/**
 * Vercel Postgres + Drizzle client.
 *
 * The drizzle() call with no client argument auto-connects via the
 * POSTGRES_URL env var provided by the Vercel Postgres integration.
 * At build time the env var may be absent -- drizzle lazily connects
 * so the import itself is safe.
 */
export const db = drizzle({ schema });

export type Database = typeof db;
