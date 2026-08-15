import { describe, expect, it } from "vitest";
import { isSafeEmbedUrl, parsePlaylistUrl } from "./embeds";
import { slugSchema } from "./slugs";

describe("parsePlaylistUrl — Spotify", () => {
  it("parses a playlist URL and strips query params", () => {
    const r = parsePlaylistUrl(
      "https://open.spotify.com/playlist/37i9dQZF1DXd8cOUiye1o2?si=abc123",
    );
    expect(r).toMatchObject({
      ok: true,
      embed: {
        provider: "spotify",
        embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DXd8cOUiye1o2",
      },
    });
  });

  it("handles intl locale path segments", () => {
    const r = parsePlaylistUrl(
      "https://open.spotify.com/intl-hi/album/4aawyAB9vmqN3uQ7FjRGTy",
    );
    expect(r).toMatchObject({
      ok: true,
      embed: { embedUrl: "https://open.spotify.com/embed/album/4aawyAB9vmqN3uQ7FjRGTy" },
    });
  });

  it("rejects non-media Spotify paths", () => {
    expect(parsePlaylistUrl("https://open.spotify.com/download").ok).toBe(false);
  });
});

describe("parsePlaylistUrl — YouTube", () => {
  it("parses a playlist URL", () => {
    const r = parsePlaylistUrl(
      "https://www.youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj",
    );
    expect(r).toMatchObject({
      ok: true,
      embed: {
        provider: "youtube",
        embedUrl:
          "https://www.youtube.com/embed/videoseries?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj",
      },
    });
  });

  it("parses a YouTube Music playlist", () => {
    const r = parsePlaylistUrl("https://music.youtube.com/playlist?list=PLabc_123-XYZ");
    expect(r.ok).toBe(true);
  });

  it("warns on auto-generated RD mixes", () => {
    const r = parsePlaylistUrl("https://music.youtube.com/watch?v=abc12345678&list=RDAMVMxyz");
    expect(r.ok && r.warning).toBeTruthy();
  });

  it("prefers the playlist over the video when both present", () => {
    const r = parsePlaylistUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PL123abc");
    expect(r.ok && r.embed.embedUrl).toContain("videoseries?list=PL123abc");
  });

  it("parses a bare watch URL as a single video", () => {
    const r = parsePlaylistUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(r).toMatchObject({
      ok: true,
      embed: { embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    });
  });

  it("parses youtu.be short links", () => {
    const r = parsePlaylistUrl("youtu.be/dQw4w9WgXcQ");
    expect(r.ok && r.embed.embedUrl).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
  });
});

describe("parsePlaylistUrl — SoundCloud", () => {
  it("wraps any track/playlist URL in the widget player", () => {
    const r = parsePlaylistUrl("https://soundcloud.com/forss/flickermood");
    expect(r.ok && r.embed.provider).toBe("soundcloud");
    expect(r.ok && r.embed.embedUrl).toContain(
      "w.soundcloud.com/player/?url=https%3A%2F%2Fsoundcloud.com%2Fforss%2Fflickermood",
    );
  });

  it("rejects the bare homepage", () => {
    expect(parsePlaylistUrl("https://soundcloud.com/").ok).toBe(false);
  });
});

describe("parsePlaylistUrl — rejection", () => {
  it.each([
    "https://example.com/playlist/123",
    "not a url at all :::",
    "",
    "https://open.spotify.com.evil.com/playlist/abc123",
  ])("rejects %s", (input) => {
    expect(parsePlaylistUrl(input).ok).toBe(false);
  });
});

describe("isSafeEmbedUrl", () => {
  it("accepts whitelisted https hosts", () => {
    expect(isSafeEmbedUrl("https://open.spotify.com/embed/playlist/abc")).toBe(true);
    expect(isSafeEmbedUrl("https://www.youtube.com/embed/x")).toBe(true);
    expect(isSafeEmbedUrl("https://w.soundcloud.com/player/?url=x")).toBe(true);
  });
  it("rejects everything else", () => {
    expect(isSafeEmbedUrl("https://evil.com/embed")).toBe(false);
    expect(isSafeEmbedUrl("http://open.spotify.com/embed/playlist/abc")).toBe(false);
    expect(isSafeEmbedUrl("javascript:alert(1)")).toBe(false);
  });
});

describe("slugSchema", () => {
  it.each(["delux", "my-radio", "abc", "a1-b2-c3"])("accepts %s", (s) => {
    expect(slugSchema.safeParse(s).success).toBe(true);
  });
  it.each(["ab", "-abc", "abc-", "UPPER ok?", "www", "dashboard", "a".repeat(31)])(
    "rejects %s",
    (s) => {
      expect(slugSchema.safeParse(s).success).toBe(false);
    },
  );
  it("normalizes case before checks", () => {
    // .toLowerCase() runs before the reserved check, so "WWW" is also caught
    expect(slugSchema.safeParse("WWW").success).toBe(false);
  });
});
