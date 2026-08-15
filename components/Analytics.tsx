"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

/* Tracks every page view (app pages AND tenant radio pages — the host
   distinguishes them) across client-side navigations. */
export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    track("Page View", {
      path: pathname,
      host: window.location.hostname,
    });
  }, [pathname]);

  return null;
}
