"use client";

/* Compact deluxsalon-style player bar for YouTube playlists/videos.
   The real player lives in a tiny visually-hidden "bridge" (kept in normal
   flow for autoplay-policy compatibility — same pattern as deluxsalon.in);
   the visible art is a static video thumbnail, and our controls drive the
   bridge through YouTube's widget postMessage API. */

import { useEffect, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { track } from "@/lib/analytics";

interface Props {
  embedUrl: string;
}

interface PlayerInfo {
  title: string;
  author: string;
  videoId: string | null;
  currentTime: number;
  duration: number;
  playerState: number; // 1 playing, 2 paused
}

function formatTime(s: number) {
  if (!Number.isFinite(s) || s <= 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function initialVideoId(embedUrl: string): string | null {
  const m = embedUrl.match(/\/embed\/([A-Za-z0-9_-]{5,20})(?:\?|$)/);
  return m && m[1] !== "videoseries" ? m[1] : null;
}

export function YouTubePlayer({ embedUrl }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [info, setInfo] = useState<PlayerInfo>({
    title: "",
    author: "",
    videoId: initialVideoId(embedUrl),
    currentTime: 0,
    duration: 0,
    playerState: -1,
  });

  const isPlaylist = embedUrl.includes("videoseries");
  const src = `${embedUrl}${embedUrl.includes("?") ? "&" : "?"}enablejsapi=1&playsinline=1&controls=0&rel=0`;

  function post(payload: object) {
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify(payload), "*");
  }
  const command = (func: string, args: unknown[] = []) =>
    post({ event: "command", func, args });
  const startListening = () =>
    post({ event: "listening", id: 1, channel: "widget" });

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (typeof e.origin !== "string" || !e.origin.includes("youtube")) return;
      if (e.source !== iframeRef.current?.contentWindow) return;
      let data: {
        event?: string;
        info?: {
          currentTime?: number;
          duration?: number;
          playerState?: number;
          videoData?: { title?: string; author?: string; video_id?: string };
        };
      };
      try {
        data = JSON.parse(e.data);
      } catch {
        return;
      }
      if (data.event === "onReady") {
        startListening();
        return;
      }
      const i = data.info;
      if (!i) return;
      setInfo((prev) => ({
        title: i.videoData?.title ?? prev.title,
        author: i.videoData?.author ?? prev.author,
        videoId: i.videoData?.video_id ?? prev.videoId,
        currentTime: i.currentTime ?? prev.currentTime,
        duration: i.duration ?? prev.duration,
        playerState: i.playerState ?? prev.playerState,
      }));
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handler only reads refs
  }, []);

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    if (!info.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    command("seekTo", [ratio * info.duration, true]);
  }

  const playing = info.playerState === 1;
  const progress = info.duration
    ? Math.min(100, (info.currentTime / info.duration) * 100)
    : 0;
  // mqdefault is true 16:9 — hqdefault carries 4:3 letterbox bars that
  // show up when cropped square.
  const thumb = info.videoId
    ? `https://img.youtube.com/vi/${info.videoId}/mqdefault.jpg`
    : null;

  return (
    <div className="relative w-full">
      {/* Player bridge: in normal flow but visually hidden — browser
          autoplay policies require a rendered player. */}
      <div className="pointer-events-none fixed bottom-1 left-1 h-2 w-2 overflow-hidden opacity-10">
        <iframe
          ref={iframeRef}
          src={src}
          onLoad={startListening}
          allow="autoplay; encrypted-media"
          className="h-[100px] w-[100px] border-0"
          title="YouTube player"
        />
      </div>

      {/* Art on the left; title + controls, then progress — deluxsalon metrics */}
      <div className="flex items-center gap-3">
        {/* Album art as a spinning CD — turns only while playing */}
        <div
          className="animate-cd-spin relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/25 shadow-[0_0_12px_rgba(0,0,0,0.6)]"
          style={{ animationPlayState: playing ? "running" : "paused" }}
        >
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element -- YouTube CDN thumbnail
            <img src={thumb} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-white/10 text-lg">
              📻
            </div>
          )}
          {/* Vinyl sheen + spindle hole */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.25),transparent_45%)]"
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-[#140a08]"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-[13px] font-bold text-white">
                {info.title || "Ready to play"}
              </p>
              <p className="truncate text-[10px] text-white/60">
                {info.author || (isPlaylist ? "playlist" : "YouTube")}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              {isPlaylist && (
                <button
                  type="button"
                  onClick={() => command("previousVideo")}
                  aria-label="Previous track"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/90 transition-all hover:scale-105 hover:bg-white/25 hover:text-white"
                >
                  <SkipBack size={14} fill="currentColor" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (!playing) track("Player Play", { title: info.title });
                  command(playing ? "pauseVideo" : "playVideo");
                }}
                aria-label={playing ? "Pause" : "Play"}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-[#f59e0b] text-black shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all hover:scale-110 hover:bg-[#fbbf24]"
              >
                {playing ? (
                  <Pause size={18} fill="currentColor" />
                ) : (
                  <Play size={18} fill="currentColor" className="ml-0.5" />
                )}
              </button>
              {isPlaylist && (
                <button
                  type="button"
                  onClick={() => command("nextVideo")}
                  aria-label="Next track"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/90 transition-all hover:scale-105 hover:bg-white/25 hover:text-white"
                >
                  <SkipForward size={14} fill="currentColor" />
                </button>
              )}
            </div>
          </div>

          {/* Progress, indented to the title column like the reference */}
          <div className="mt-1 flex items-center gap-2">
            <span className="shrink-0 font-mono text-[10px] tabular-nums text-white/60">
              {formatTime(info.currentTime)}
            </span>
            <div
              onClick={seek}
              className="h-[5px] flex-1 cursor-pointer overflow-hidden rounded-full bg-white/20"
            >
              <div
                className="h-full rounded-full bg-[#f59e0b] transition-[width] duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="shrink-0 font-mono text-[10px] tabular-nums text-white/60">
              {formatTime(info.duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
