import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------
export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").unique().notNull(),
  email: text("email").notNull(),
  name: text("name"),
  company: text("company"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const customersRelations = relations(customers, ({ many }) => ({
  licenses: many(licenses),
}));

// ---------------------------------------------------------------------------
// Licenses
// ---------------------------------------------------------------------------
export const licenses = pgTable("licenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),
  tier: text("tier", { enum: ["free", "pro", "enterprise"] }).notNull(),
  licenseKey: text("license_key").unique().notNull(),
  status: text("status", {
    enum: ["active", "expired", "revoked"],
  }).default("active"),
  maxActivations: integer("max_activations").default(1),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  lemonSqueezyOrderId: text("lemon_squeezy_order_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const licensesRelations = relations(licenses, ({ one, many }) => ({
  customer: one(customers, {
    fields: [licenses.customerId],
    references: [customers.id],
  }),
  activations: many(activations),
}));

// ---------------------------------------------------------------------------
// Activations
// ---------------------------------------------------------------------------
export const activations = pgTable("activations", {
  id: uuid("id").primaryKey().defaultRandom(),
  licenseId: uuid("license_id")
    .notNull()
    .references(() => licenses.id),
  machineFingerprint: text("machine_fingerprint").notNull(),
  activationCode: text("activation_code").notNull(),
  activatedAt: timestamp("activated_at", { withTimezone: true }).defaultNow(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
});

export const activationsRelations = relations(activations, ({ one }) => ({
  license: one(licenses, {
    fields: [activations.licenseId],
    references: [licenses.id],
  }),
}));

// ---------------------------------------------------------------------------
// Type helpers
// ---------------------------------------------------------------------------
export type Customer = typeof customers.$inferSelect;
export type License = typeof licenses.$inferSelect;
export type Activation = typeof activations.$inferSelect;
