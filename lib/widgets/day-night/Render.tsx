"use client";

import { useEffect, useState } from "react";

/* Tints the page to match each VISITOR's local time of day — warm in the
   morning, untouched at noon, orange at golden hour, deep blue at night.
   Renders nothing until mounted so SSR output stays deterministic. */
export function DayNightRender() {
  const [tint, setTint] = useState<string | null>(null);

  useEffect(() => {
    function update() {
      const hour = new Date().getHours();
      if (hour >= 22 || hour < 5) setTint("bg-[#0b1026]/55");
      else if (hour < 11) setTint("bg-amber-200/10");
      else if (hour < 17) setTint(null);
      else setTint("bg-orange-500/15");
    }
    const t = setTimeout(update, 0);
    const interval = setInterval(update, 60_000);
    return () => {
      clearTimeout(t);
      clearInterval(interval);
    };
  }, []);

  if (!tint) return null;
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 transition-colors duration-1000 ${tint}`}
    />
  );
}
