import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Local dev uses lvh.me (and *.lvh.me tenant subdomains) instead of
  // localhost; without this the dev server 403s asset requests and
  // client components never hydrate.
  allowedDevOrigins: ["lvh.me", "*.lvh.me"],
};

export default nextConfig;
