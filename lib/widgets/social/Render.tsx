import type { WidgetRenderProps } from "@/lib/widgets/types";

export function SocialRender({ config }: WidgetRenderProps<"social">) {
  const links: { label: string; href: string }[] = [];

  if (config.whatsapp) {
    const digits = config.whatsapp.replace(/\D/g, "");
    if (digits) links.push({ label: "WhatsApp", href: `https://wa.me/${digits}` });
  }
  if (config.instagram) links.push({ label: "Instagram", href: config.instagram });
  if (config.youtube) links.push({ label: "YouTube", href: config.youtube });
  if (config.twitter) links.push({ label: "Twitter", href: config.twitter });

  if (!links.length) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-[var(--site-border)] bg-[var(--site-surface)] px-4 py-1.5 text-sm text-[var(--site-text)] transition-colors hover:border-[var(--site-primary)] hover:text-[var(--site-primary)]"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
