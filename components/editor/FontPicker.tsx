"use client";

import { Controller, useFormContext } from "react-hook-form";
import type { SiteConfig } from "@/lib/site-config";

const options: { id: SiteConfig["fontId"]; label: string; previewClass: string }[] = [
  { id: "auto", label: "Theme default", previewClass: "" },
  { id: "serif", label: "Serif", previewClass: "font-theme-serif" },
  { id: "sans", label: "Sans", previewClass: "font-theme-sans" },
  { id: "mono", label: "Mono", previewClass: "font-theme-mono" },
];

export function FontPicker() {
  const { control } = useFormContext<SiteConfig>();

  return (
    <Controller
      control={control}
      name="fontId"
      render={({ field }) => (
        <div className="grid grid-cols-2 gap-2">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => field.onChange(option.id)}
              className={`flex items-center gap-2 rounded-lg border p-2 text-left transition-colors ${
                field.value === option.id
                  ? "border-[#b3402a] ring-1 ring-[#b3402a]"
                  : "border-[#2a2118]/15 hover:border-[#2a2118]/40"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#2a2118]/5 text-sm ${option.previewClass}`}
              >
                Ag
              </span>
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    />
  );
}
