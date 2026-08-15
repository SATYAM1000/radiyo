"use client";

import { Controller, type Control } from "react-hook-form";
import type { SiteConfig } from "@/lib/site-config";

export function ClockEditorFields({ control }: { control: Control<SiteConfig> }) {
  return (
    <Controller
      control={control}
      name="widgets.clock.format"
      render={({ field }) => (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#2a2118]/60">Format</span>
          {(["12h", "24h"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => field.onChange(f)}
              className={`rounded px-2 py-1 ${
                field.value === f
                  ? "bg-[#b3402a] text-white"
                  : "bg-[#2a2118]/5 text-[#2a2118]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}
    />
  );
}
