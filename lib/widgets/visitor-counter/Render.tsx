"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { WidgetRenderProps } from "@/lib/widgets/types";

/* Shows the number of people on the page RIGHT NOW via Supabase Realtime
   presence — every open tab joins a per-site channel and the pill shows the
   member count. Lifetime visits are still incremented in the background
   (site_stats) for future analytics, but no longer displayed. */
export function VisitorCounterRender({
  config,
  mode,
  slug,
}: WidgetRenderProps<"visitorCounter">) {
  const [count, setCount] = useState<number | null>(
    mode === "preview" ? 1337 : null,
  );

  useEffect(() => {
    if (mode !== "live" || !slug) return;
    const supabase = createClient();

    // Keep the lifetime visit stat, one increment per browser session.
    const visitKey = `vr-visited-${slug}`;
    if (!sessionStorage.getItem(visitKey)) {
      supabase.rpc("increment_visits", { p_slug: slug }).then(({ error }) => {
        if (!error) sessionStorage.setItem(visitKey, "1");
      });
    }

    const channel = supabase.channel(`presence:site:${slug}`, {
      config: {
        presence: { key: Math.random().toString(36).slice(2) },
      },
    });
    channel.on("presence", { event: "sync" }, () => {
      setCount(Object.keys(channel.presenceState()).length);
    });
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        channel.track({ online_at: new Date().toISOString() });
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mode, slug]);

  return (
    <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-xs text-white/90 backdrop-blur-sm">
      <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-green-400" />
      <span className="font-mono tabular-nums">
        {count === null ? "···" : count.toLocaleString()}
      </span>
      <span className="text-white/60">{config.label || "online"}</span>
    </span>
  );
}
