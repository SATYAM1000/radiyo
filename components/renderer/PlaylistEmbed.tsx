"use client";

import { useState } from "react";
import { EMBED_HEIGHTS } from "@/lib/embeds";
import type { PlaylistEmbed as PlaylistEmbedData } from "@/lib/site-config";
import { YouTubePlayer } from "@/components/renderer/YouTubePlayer";

interface Props {
  playlist: PlaylistEmbedData;
  mode: "preview" | "live";
}

const providerLabels = {
  spotify: "Spotify",
  youtube: "YouTube",
  soundcloud: "SoundCloud",
} as const;

export function PlaylistEmbed({ playlist, mode }: Props) {
  // In the editor preview the real iframe stays unmounted until asked for,
  // so editing never blasts audio.
  const [activated, setActivated] = useState(mode === "live");
  const compactYouTube = playlist.provider === "youtube";
  const height = compactYouTube ? 92 : EMBED_HEIGHTS[playlist.provider];

  if (!activated) {
    return (
      <button
        type="button"
        onClick={() => setActivated(true)}
        style={{ height }}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 text-white/60 transition-colors hover:border-white/50 hover:text-white"
      >
        <span className="text-3xl">▶</span>
        <span className="text-sm">
          {providerLabels[playlist.provider]} player — click to preview
        </span>
      </button>
    );
  }

  if (compactYouTube) {
    return <YouTubePlayer embedUrl={playlist.embedUrl} />;
  }

  return (
    <iframe
      src={playlist.embedUrl}
      height={height}
      loading="lazy"
      allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
      className="w-full rounded-xl border-0"
      title={`${providerLabels[playlist.provider]} player`}
    />
  );
}
