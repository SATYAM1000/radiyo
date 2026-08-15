"use client";

import { Controller, type Control } from "react-hook-form";
import { AMBIENT_LABELS, type AmbientSound } from "@/lib/ambient";
import type { SiteConfig } from "@/lib/site-config";

export function AmbientEditorFields({ control }: { control: Control<SiteConfig> }) {
  return (
    <Controller
      control={control}
      name="widgets.ambient.sound"
      render={({ field }) => (
        <div className="flex items-center gap-2 text-sm">
          {(Object.keys(AMBIENT_LABELS) as AmbientSound[]).map((sound) => (
            <button
              key={sound}
              type="button"
              onClick={() => field.onChange(sound)}
              className={`rounded px-2.5 py-1 ${
                field.value === sound
                  ? "bg-[#b3402a] text-white"
                  : "bg-[#2a2118]/5 text-[#2a2118]"
              }`}
            >
              {AMBIENT_LABELS[sound]}
            </button>
          ))}
        </div>
      )}
    />
  );
}
