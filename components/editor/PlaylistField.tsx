"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { parsePlaylistUrl } from "@/lib/embeds";
import type { SiteConfig } from "@/lib/site-config";

const providerLabels = {
  spotify: "Spotify",
  youtube: "YouTube",
  soundcloud: "SoundCloud",
} as const;

export function PlaylistField() {
  const { control } = useFormContext<SiteConfig>();
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  return (
    <Controller
      control={control}
      name="playlist"
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          {field.value ? (
            <div className="flex items-center justify-between rounded-md border border-[#2a2118]/15 bg-white px-3 py-2">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  {providerLabels[field.value.provider]}
                  <Check size={14} className="text-green-700" strokeWidth={3} />
                </p>
                <p className="truncate text-xs text-[#2a2118]/50">
                  {field.value.originalUrl}
                </p>
              </div>
              <button
                type="button"
                className="text-xs text-[#2a2118]/50 hover:text-red-700 hover:underline"
                onClick={() => {
                  field.onChange(null);
                  setWarning(null);
                }}
              >
                Remove
              </button>
            </div>
          ) : (
            <input
              type="url"
              placeholder="Paste a Spotify, YouTube, or SoundCloud link…"
              className="rounded-md border border-[#2a2118]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#b3402a]"
              onChange={(e) => {
                const value = e.target.value.trim();
                if (!value) {
                  setError(null);
                  return;
                }
                const result = parsePlaylistUrl(value);
                if (result.ok) {
                  setError(null);
                  setWarning(result.warning ?? null);
                  field.onChange(result.embed);
                  e.target.value = "";
                } else {
                  setError(result.error);
                }
              }}
            />
          )}
          {error && <p className="text-xs text-red-700">{error}</p>}
          {warning && <p className="text-xs text-amber-700">{warning}</p>}
        </div>
      )}
    />
  );
}
