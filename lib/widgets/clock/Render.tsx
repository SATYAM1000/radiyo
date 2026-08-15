"use client";

import { useEffect, useState } from "react";
import type { WidgetRenderProps } from "@/lib/widgets/types";

export function ClockRender({ config }: WidgetRenderProps<"clock">) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const t0 = setTimeout(() => setNow(new Date()), 0);
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearTimeout(t0);
      clearInterval(t);
    };
  }, []);

  // SSR renders a stable placeholder to avoid hydration mismatch.
  const text = now
    ? now.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        hour12: config.format === "12h",
      })
    : "--:--";

  return (
    <span className="rounded-full border border-white/10 bg-black/45 px-3 py-1 font-mono text-xs tabular-nums text-white/90 backdrop-blur-sm">
      {text}
    </span>
  );
}
