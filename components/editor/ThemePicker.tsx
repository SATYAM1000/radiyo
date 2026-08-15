"use client";

import { Controller, useFormContext } from "react-hook-form";
import { themes } from "@/lib/themes";
import type { SiteConfig } from "@/lib/site-config";

export function ThemePicker() {
  const { control } = useFormContext<SiteConfig>();

  return (
    <Controller
      control={control}
      name="themeId"
      render={({ field }) => (
        <div className="grid grid-cols-2 gap-2">
          {Object.values(themes).map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => field.onChange(theme.id)}
              className={`flex items-center gap-2 rounded-lg border p-2 text-left transition-colors ${
                field.value === theme.id
                  ? "border-[#b3402a] ring-1 ring-[#b3402a]"
                  : "border-[#2a2118]/15 hover:border-[#2a2118]/40"
              }`}
            >
              <span className="flex shrink-0 overflow-hidden rounded">
                {(["--site-bg", "--site-primary", "--site-accent"] as const).map(
                  (v) => (
                    <span
                      key={v}
                      className="h-6 w-3"
                      style={{ background: theme.vars[v] }}
                    />
                  ),
                )}
              </span>
              <span className="text-xs font-medium">{theme.label}</span>
            </button>
          ))}
        </div>
      )}
    />
  );
}
