import type { WidgetRenderProps } from "@/lib/widgets/types";

// Zero-JS accordion via native <details>/<summary>.
export function FaqRender({ config }: WidgetRenderProps<"faq">) {
  const items = config.items.filter((i) => i.q.trim());
  if (!items.length) return null;

  return (
    <section id="faq" className="w-full">
      <h2 className="mb-4 text-center text-xl font-semibold text-[var(--site-text)]">
        FAQ
      </h2>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-lg border border-[var(--site-border)] bg-[var(--site-surface)] px-4 py-3"
          >
            <summary className="cursor-pointer list-none font-medium text-[var(--site-text)] marker:content-none">
              <span className="mr-2 inline-block text-[var(--site-primary)] transition-transform group-open:rotate-90">
                ▸
              </span>
              {item.q}
            </summary>
            <p className="mt-2 whitespace-pre-line pl-6 text-sm text-[var(--site-muted)]">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
