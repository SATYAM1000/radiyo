import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : "";

const nextConfig: NextConfig = {
  // Local dev uses lvh.me (and *.lvh.me tenant subdomains) instead of
  // localhost; without this the dev server 403s asset requests and
  // client components never hydrate.
  allowedDevOrigins: ["lvh.me", "*.lvh.me"],
  images: {
    remotePatterns: [
      // User uploads (Supabase Storage) and YouTube thumbnails get
      // device-sized WebP/AVIF variants via the image optimizer.
      ...(supabaseHost
        ? [{ protocol: "https" as const, hostname: supabaseHost }]
        : []),
      { protocol: "https" as const, hostname: "img.youtube.com" },
    ],
  },
};

export default nextConfig;
