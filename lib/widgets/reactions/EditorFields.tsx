"use client";

import { Controller, useFormContext } from "react-hook-form";
import type { SiteConfig } from "@/lib/site-config";

const PALETTE = ["🔥", "❤️", "😂", "🥹", "💈", "🇮🇳", "🙏", "🎉", "✨", "📻", "🍵", "🌙"];
const MAX = 6;

export function ReactionsEditorFields() {
  const { control } = useFormContext<SiteConfig>();

  return (
    <Controller
      control={control}
      name="widgets.reactions.emojis"
      render={({ field }) => {
        const selected: string[] = field.value ?? [];
        function toggle(emoji: string) {
          if (selected.includes(emoji)) {
            if (selected.length > 1)
              field.onChange(selected.filter((e) => e !== emoji));
          } else if (selected.length < MAX) {
            field.onChange([...selected, emoji]);
          }
        }
        return (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1.5">
              {PALETTE.map((emoji) => {
                const active = selected.includes(emoji);
                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => toggle(emoji)}
                    aria-pressed={active}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border text-lg transition-all ${
                      active
                        ? "border-[#b3402a] bg-[#b3402a]/10 ring-1 ring-[#b3402a]"
                        : "border-[#2a2118]/15 opacity-50 hover:opacity-100"
                    }`}
                  >
                    {emoji}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-[#2a2118]/50">
              Pick up to {MAX} — visitors react with these, and every tap
              floats up live on all open screens.
            </p>
          </div>
        );
      }}
    />
  );
}
