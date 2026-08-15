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

/* Nothing here autoplays, so preview and live render identically. */
export function PlaylistEmbed({ playlist }: Props) {
  if (playlist.provider === "youtube") {
    return <YouTubePlayer embedUrl={playlist.embedUrl} />;
  }

  return (
    <iframe
      src={playlist.embedUrl}
      height={EMBED_HEIGHTS[playlist.provider]}
      loading="lazy"
      allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
      className="w-full rounded-xl border-0"
      title={`${providerLabels[playlist.provider]} player`}
    />
  );
}
