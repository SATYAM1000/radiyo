import { z } from "zod";

// Mirror of the DB seed in supabase/migrations/0004_reserved_seed.sql —
// checked client-side for instant feedback; the DB trigger is the backstop.
export const RESERVED_SLUGS = new Set([
  "www", "app", "api", "admin", "auth", "mail", "smtp",
  "blog", "docs", "support", "help", "status", "dashboard",
  "editor", "dev", "staging", "test", "demo", "cdn",
  "assets", "static", "media", "vercel", "supabase", "root",
  "ns1", "ns2", "ftp", "my", "account", "login", "signup",
  "billing", "pricing", "about", "legal", "terms", "privacy",
]);

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "At least 3 characters")
  .max(30, "At most 30 characters")
  .regex(
    /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
    "Lowercase letters, numbers, and hyphens only — no leading/trailing hyphen",
  )
  .refine((s) => !RESERVED_SLUGS.has(s), "That name is reserved");

export function normalizeSlug(input: string): string {
  return input.trim().toLowerCase();
}
