"use client";

import { useEffect, useState } from "react";
import type { WidgetRenderProps } from "@/lib/widgets/types";

export function QuotesRender({ config }: WidgetRenderProps<"quotes">) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const items = config.items.filter((q) => q.trim());

  useEffect(() => {
    if (items.length < 2 || paused) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      config.intervalMs,
    );
    return () => clearInterval(t);
  }, [items.length, config.intervalMs, paused]);

  if (!items.length) return null;

  // First quote renders server-side (index starts at 0) — no flash, SEO-friendly.
  const raw = items[Math.min(index, items.length - 1)];
  // "quote — author" gets a styled byline; plain quotes fall back to the label.
  const dashAt = raw.lastIndexOf("—");
  const quote = dashAt > 0 ? raw.slice(0, dashAt).trim() : raw;
  const author = dashAt > 0 ? raw.slice(dashAt + 1).trim() : null;

  return (
    <figure
      className="rounded-2xl border border-amber-500/30 bg-black/55 px-5 py-3 text-center shadow-[0_12px_35px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-colors duration-300 hover:border-amber-400/60"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div key={index} className="animate-quote-fade">
        <blockquote className="font-theme-serif text-base italic leading-relaxed text-amber-100 drop-shadow-md">
          &ldquo;{quote}&rdquo;
        </blockquote>
        {author ? (
          <figcaption className="font-theme-sans mt-1.5 flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wide text-amber-300/90">
            <span className="h-2 w-2 rounded-full bg-amber-500/70" />— {author}
          </figcaption>
        ) : (
          <figcaption className="font-theme-sans mt-1.5 text-[10px] uppercase tracking-[0.3em] text-amber-200/60">
            overheard here
          </figcaption>
        )}
      </div>
    </figure>
  );
}
