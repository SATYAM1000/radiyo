/* The single source of truth for turning a SiteConfig into markup.
   Rendered by the published tenant page (mode="live") and the editor
   preview (mode="preview") — never fork the layout anywhere else.

   Layout: one immersive full-viewport hero — background image under a dark
   gradient, poster-size display title, floating glass pill widgets.
   Everything fits the first screen; there is nothing to scroll to. */
import { LogoMark } from "@/components/Logo";
import { themes } from "@/lib/themes";
import type { SiteConfig } from "@/lib/site-config";
import { widgetRegistry } from "@/lib/widgets/registry";
import { PlaylistEmbed } from "@/components/renderer/PlaylistEmbed";

interface Props {
  config: SiteConfig;
  mode: "preview" | "live";
  slug?: string;
}

function socialPills(social: SiteConfig["widgets"]["social"]) {
  const pills: { label: string; href: string }[] = [];
  if (social.instagram) pills.push({ label: "Instagram", href: social.instagram });
  if (social.youtube) pills.push({ label: "YouTube", href: social.youtube });
  if (social.twitter) pills.push({ label: "X", href: social.twitter });
  if (social.linkedin) pills.push({ label: "LinkedIn", href: social.linkedin });
  if (social.email) pills.push({ label: "Email", href: `mailto:${social.email}` });
  return pills;
}

const FONT_CLASSES = {
  serif: "font-theme-serif",
  sans: "font-theme-sans",
  mono: "font-theme-mono",
} as const;

export function SiteRenderer({ config, mode, slug }: Props) {
  const theme = themes[config.themeId] ?? themes.barbershop;
  const fontClass =
    config.fontId === "auto"
      ? theme.fontClass
      : FONT_CLASSES[config.fontId];
  const bgImage = config.images.background ?? config.images.hero;

  const whatsappDigits =
    config.widgets.social.enabled && config.widgets.social.whatsapp
      ? config.widgets.social.whatsapp.replace(/\D/g, "")
      : "";
  const pills = config.widgets.social.enabled
    ? socialPills(config.widgets.social)
    : [];

  const widgetProps = { site: config, mode, slug } as const;

  return (
    <div
      style={theme.vars as React.CSSProperties}
      className={`w-full ${fontClass} ${mode === "preview" ? "h-full" : "min-h-full"}`}
    >
      {/* Preview fills its scaled frame exactly; live pages fill the viewport */}
      <section
        className={`relative flex flex-col overflow-hidden bg-[#141010] text-white ${
          mode === "preview" ? "h-full" : "min-h-[100svh]"
        }`}
      >
        {bgImage && (
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/65"
        />
        <div
          aria-hidden
          className={`absolute inset-0 ${theme.texture ?? ""}`}
        />
        {config.widgets.dayNight.enabled && (
          <widgetRegistry.dayNight.Render
            config={config.widgets.dayNight}
            {...widgetProps}
          />
        )}

        <div className="relative flex flex-1 flex-col">
          {/* Top bar: status pills left, social pills right */}
          <div className="font-theme-sans flex flex-wrap items-center justify-between gap-2 p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              {config.widgets.clock.enabled && (
                <widgetRegistry.clock.Render
                  config={config.widgets.clock}
                  {...widgetProps}
                />
              )}
              {config.widgets.visitorCounter.enabled && (
                <widgetRegistry.visitorCounter.Render
                  config={config.widgets.visitorCounter}
                  {...widgetProps}
                />
              )}
              {config.widgets.ambient.enabled && (
                <widgetRegistry.ambient.Render
                  config={config.widgets.ambient}
                  {...widgetProps}
                />
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {pills.map((pill) => (
                <a
                  key={pill.label}
                  href={pill.href}
                  {...(pill.href.startsWith("mailto:")
                    ? {}
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  className="rounded-full border border-white/10 bg-black/45 px-3 py-1 text-xs text-white/90 backdrop-blur-sm transition-colors hover:bg-black/65"
                >
                  {pill.label}
                </a>
              ))}
            </div>
          </div>

          {/* Center stage */}
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-8 text-center sm:px-6">
            {config.images.logo && (
              // eslint-disable-next-line @next/next/no-img-element -- user-supplied remote URL
              <img
                src={config.images.logo}
                alt=""
                className="h-16 w-16 rounded-full border border-white/20 object-cover shadow-lg"
              />
            )}
            <h1 className="font-display max-w-4xl text-6xl leading-[1.05] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)] sm:text-8xl">
              {config.meta.siteName}
            </h1>
            {config.meta.tagline && (
              <p className="font-theme-sans text-xs font-medium uppercase tracking-[0.35em] text-white/70 sm:text-sm">
                {config.meta.tagline}
              </p>
            )}

            {whatsappDigits && (
              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-theme-sans flex w-full max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-black/55 p-3 text-left backdrop-blur-md transition-colors hover:bg-black/70"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-xl">
                  💬
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    Join the crew on WhatsApp
                  </span>
                  <span className="block truncate text-xs text-white/60">
                    New songs and updates, straight to your phone
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-[#25d366] px-4 py-1.5 text-sm font-semibold text-black">
                  Join Free
                </span>
              </a>
            )}

            {config.playlist && (
              <div className="font-theme-sans w-full max-w-[580px] overflow-hidden rounded-3xl border border-white/20 bg-[#140a08]/60 px-[18px] py-3 shadow-[0_25px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                <PlaylistEmbed playlist={config.playlist} mode={mode} />
              </div>
            )}

            {config.widgets.quotes.enabled && (
              <div className="w-full max-w-md">
                <widgetRegistry.quotes.Render
                  config={config.widgets.quotes}
                  {...widgetProps}
                />
              </div>
            )}

            {config.widgets.tipJar.enabled && (
              <widgetRegistry.tipJar.Render
                config={config.widgets.tipJar}
                {...widgetProps}
              />
            )}
          </div>

          <footer className="font-theme-sans flex items-center justify-center gap-1.5 pb-4 text-[10px] uppercase tracking-[0.3em] text-white/40">
            made with <LogoMark size={12} /> rediyo.in
          </footer>

          {config.widgets.reactions.enabled && (
            <widgetRegistry.reactions.Render
              config={config.widgets.reactions}
              {...widgetProps}
            />
          )}
        </div>
      </section>
    </div>
  );
}
