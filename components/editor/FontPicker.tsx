"use client";

import { Controller, useFormContext } from "react-hook-form";
import type { SiteConfig } from "@/lib/site-config";

const options: { id: SiteConfig["fontId"]; label: string; previewClass: string }[] = [
  { id: "auto", label: "Yatra (default)", previewClass: "font-display" },
  { id: "baloo", label: "Baloo", previewClass: "font-baloo" },
  { id: "modak", label: "Modak", previewClass: "font-modak" },
  { id: "teko", label: "Teko", previewClass: "font-teko" },
  { id: "anek", label: "Anek", previewClass: "font-anek" },
  { id: "serif", label: "Rozha", previewClass: "font-theme-serif" },
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
                className={`flex h-8 w-9 shrink-0 items-center justify-center rounded bg-[#2a2118]/5 text-base ${option.previewClass}`}
              >
                अA
              </span>
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    />
  );
}
