"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { WidgetRenderProps } from "@/lib/widgets/types";

const EMOJIS = ["🔥", "❤️", "😂", "🥹", "💈"];

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number; // percent from left
}

/* Emoji bar in the corner; a tap broadcasts over a Supabase Realtime channel
   so the emoji floats up on EVERY viewer's screen at the same moment. */
export function ReactionsRender({ mode, slug }: WidgetRenderProps<"reactions">) {
  const [floats, setFloats] = useState<FloatingEmoji[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const idRef = useRef(0);
  const cooling = useRef(false);

  const spawn = useCallback((emoji: string) => {
    const id = ++idRef.current;
    const x = 15 + Math.random() * 70;
    setFloats((f) => [...f, { id, emoji, x }]);
    setTimeout(() => setFloats((f) => f.filter((o) => o.id !== id)), 2600);
  }, []);

  useEffect(() => {
    if (mode !== "live" || !slug) return;
    const supabase = createClient();
    const channel = supabase.channel(`reactions:site:${slug}`, {
      config: { broadcast: { self: true } },
    });
    channel.on("broadcast", { event: "reaction" }, (msg) => {
      const emoji = (msg.payload as { emoji?: string })?.emoji;
      if (emoji && EMOJIS.includes(emoji)) spawn(emoji);
    });
    channel.subscribe();
    channelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [mode, slug, spawn]);

  function send(emoji: string) {
    if (cooling.current) return; // gentle rate limit
    cooling.current = true;
    setTimeout(() => {
      cooling.current = false;
    }, 300);
    if (channelRef.current) {
      channelRef.current.send({
        type: "broadcast",
        event: "reaction",
        payload: { emoji },
      });
    } else {
      spawn(emoji); // preview / channel not ready: float locally
    }
  }

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {floats.map((f) => (
          <span
            key={f.id}
            className="animate-float-up absolute bottom-20 text-3xl"
            style={{ left: `${f.x}%` }}
          >
            {f.emoji}
          </span>
        ))}
      </div>
      <div className="absolute bottom-4 right-4 flex items-center gap-0.5 rounded-full border border-white/10 bg-black/45 px-2 py-1.5 backdrop-blur-sm">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => send(emoji)}
            aria-label={`React with ${emoji}`}
            className="px-1 text-lg transition-transform hover:scale-125 active:scale-90"
          >
            {emoji}
          </button>
        ))}
      </div>
    </>
  );
}
