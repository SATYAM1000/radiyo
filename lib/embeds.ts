import type { PlaylistEmbed } from "@/lib/site-config";

export type ParseResult =
  | { ok: true; embed: PlaylistEmbed; warning?: string }
  | { ok: false; error: string };

const GENERIC_ERROR =
  "We couldn't recognize that link. Paste a Spotify, YouTube, or SoundCloud playlist URL.";

// Hostnames the renderer is allowed to iframe. Also used to re-validate
// stored embedUrls server-side at publish time.
export const ALLOWED_EMBED_HOSTS = new Set([
  "open.spotify.com",
  "www.youtube.com",
  "w.soundcloud.com",
]);

const SPOTIFY_TYPES = new Set(["playlist", "album", "track", "artist"]);

export function parsePlaylistUrl(input: string): ParseResult {
  const raw = input.trim();
  if (!raw) return { ok: false, error: GENERIC_ERROR };

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return { ok: false, error: GENERIC_ERROR };
  }

  const host = url.hostname.toLowerCase();

  // --- Spotify ---
  if (host === "open.spotify.com") {
    // Paths may include a locale segment: /intl-hi/playlist/{id}
    const parts = url.pathname.split("/").filter(Boolean);
    const start = parts[0]?.startsWith("intl-") ? 1 : 0;
    const type = parts[start];
    const id = parts[start + 1];
    if (type && id && SPOTIFY_TYPES.has(type) && /^[A-Za-z0-9]+$/.test(id)) {
      return {
        ok: true,
        embed: {
          provider: "spotify",
          originalUrl: raw,
          embedUrl: `https://open.spotify.com/embed/${type}/${id}`,
        },
      };
    }
    return { ok: false, error: "That Spotify link isn't a playlist, album, track, or artist." };
  }

  // --- YouTube / YouTube Music ---
  if (
    host === "youtube.com" ||
    host === "www.youtube.com" ||
    host === "m.youtube.com" ||
    host === "music.youtube.com"
  ) {
    const list = url.searchParams.get("list");
    const video = url.searchParams.get("v");
    if (list && /^[A-Za-z0-9_-]+$/.test(list)) {
      const warning = list.startsWith("RD")
        ? "This looks like an auto-generated YouTube mix — those often can't be embedded. A regular playlist works best."
        : undefined;
      return {
        ok: true,
        warning,
        embed: {
          provider: "youtube",
          originalUrl: raw,
          embedUrl: `https://www.youtube.com/embed/videoseries?list=${list}`,
        },
      };
    }
    if (video && /^[A-Za-z0-9_-]{5,20}$/.test(video)) {
      return {
        ok: true,
        embed: {
          provider: "youtube",
          originalUrl: raw,
          embedUrl: `https://www.youtube.com/embed/${video}`,
        },
      };
    }
    return { ok: false, error: "That YouTube link has no playlist or video in it." };
  }

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    if (id && /^[A-Za-z0-9_-]{5,20}$/.test(id)) {
      return {
        ok: true,
        embed: {
          provider: "youtube",
          originalUrl: raw,
          embedUrl: `https://www.youtube.com/embed/${id}`,
        },
      };
    }
    return { ok: false, error: GENERIC_ERROR };
  }

  // --- SoundCloud ---
  if (host === "soundcloud.com" || host === "on.soundcloud.com") {
    if (url.pathname.length > 1) {
      return {
        ok: true,
        embed: {
          provider: "soundcloud",
          originalUrl: raw,
          embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url.href)}&color=%23b3402a&auto_play=false`,
        },
      };
    }
    return { ok: false, error: GENERIC_ERROR };
  }

  return { ok: false, error: GENERIC_ERROR };
}

// Server-side guard used by the publish action: a tampered client could have
// written an arbitrary embedUrl into draft_config.
export function isSafeEmbedUrl(embedUrl: string): boolean {
  try {
    const url = new URL(embedUrl);
    return url.protocol === "https:" && ALLOWED_EMBED_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

// Compact card heights; YouTube uses the custom player bar instead.
export const EMBED_HEIGHTS: Record<PlaylistEmbed["provider"], number> = {
  spotify: 152,
  youtube: 92,
  soundcloud: 166,
};
