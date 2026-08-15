import { z } from "zod";

// react-hook-form registers text inputs as "" when empty, so every optional
// validated field must accept the empty string too.
function emptyOr<T extends z.ZodTypeAny>(schema: T) {
  return schema.optional().or(z.literal(""));
}

// Full URLs (user uploads via Storage) or root-relative paths (the built-in
// gallery under /public). Anything else — including javascript: — is rejected.
function imageSrc() {
  return z
    .string()
    .url()
    .or(z.string().regex(/^\/[a-zA-Z0-9_\-./]+$/))
    .nullable()
    .default(null);
}

export const THEME_IDS = [
  "barbershop",
  "cassette",
  "monsoon",
  "neon-dhaba",
  "sepia",
] as const;

export const playlistSchema = z.object({
  provider: z.enum(["spotify", "youtube", "soundcloud"]),
  originalUrl: z.string().url(),
  // Derived at write time (lib/embeds.ts) and re-validated at publish time,
  // so the renderer can trust it blindly.
  embedUrl: z.string().url(),
});

export const siteConfigSchema = z.object({
  version: z.literal(1),
  meta: z.object({
    siteName: z.string().min(1).max(60),
    tagline: z.string().max(120).default(""),
    aboutText: z.string().max(5000).default(""),
  }),
  images: z.object({
    hero: imageSrc(),
    background: imageSrc(),
    logo: imageSrc(),
  }),
  themeId: z.enum(THEME_IDS).default("barbershop"),
  // Body font: "auto" follows the theme's pairing; the rest override it.
  fontId: z.enum(["auto", "serif", "sans", "mono"]).default("auto"),
  playlist: playlistSchema.nullable().default(null),
  widgets: z.object({
    clock: z.object({
      enabled: z.boolean(),
      format: z.enum(["12h", "24h"]).default("12h"),
    }),
    quotes: z.object({
      enabled: z.boolean(),
      items: z.array(z.string().max(300)).max(50),
      intervalMs: z.number().int().min(3000).max(60000).default(8000),
    }),
    visitorCounter: z.object({
      enabled: z.boolean(),
      label: z.string().max(40).default("people vibing here"),
    }),
    faq: z.object({
      enabled: z.boolean(),
      items: z
        .array(z.object({ q: z.string().max(200), a: z.string().max(2000) }))
        .max(20),
    }),
    // .default() keeps configs saved before these widgets existed parseable.
    reactions: z
      .object({ enabled: z.boolean() })
      .default({ enabled: false }),
    tipJar: z
      .object({
        enabled: z.boolean(),
        upiId: z.string().max(60).default(""),
        buttonText: z.string().max(30).default("🍵 Chai pilao"),
      })
      .default({ enabled: false, upiId: "", buttonText: "🍵 Chai pilao" }),
    dayNight: z
      .object({ enabled: z.boolean() })
      .default({ enabled: false }),
    ambient: z
      .object({
        enabled: z.boolean(),
        sound: z.enum(["rain", "fan", "crickets"]).default("rain"),
      })
      .default({ enabled: false, sound: "rain" }),
    social: z.object({
      enabled: z.boolean(),
      whatsapp: z.string().max(20).optional(),
      // Form inputs store "" when cleared — always allow it alongside a URL.
      instagram: emptyOr(z.string().url()),
      youtube: emptyOr(z.string().url()),
      twitter: emptyOr(z.string().url()),
      linkedin: emptyOr(z.string().url()),
      email: emptyOr(z.string().email()),
    }),
  }),
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;
export type PlaylistEmbed = z.infer<typeof playlistSchema>;

export function defaultConfig(siteName: string): SiteConfig {
  return {
    version: 1,
    meta: { siteName, tagline: "", aboutText: "" },
    images: { hero: null, background: null, logo: null },
    themeId: "barbershop",
    fontId: "auto",
    playlist: null,
    widgets: {
      clock: { enabled: true, format: "12h" },
      quotes: {
        enabled: true,
        items: ["Bhai saab, piche se slope cut karna…"],
        intervalMs: 8000,
      },
      visitorCounter: { enabled: true, label: "people vibing here" },
      faq: { enabled: false, items: [] },
      reactions: { enabled: true },
      tipJar: { enabled: false, upiId: "", buttonText: "🍵 Chai pilao" },
      dayNight: { enabled: true },
      ambient: { enabled: false, sound: "rain" },
      social: { enabled: false },
    },
  };
}

// Single entry point for reading stored configs; when the schema gains a
// version 2, migrate older shapes here instead of migrating the database.
export function migrateConfig(raw: unknown): SiteConfig {
  return siteConfigSchema.parse(raw);
}
