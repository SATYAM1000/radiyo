"use client";

import { useEffect, useRef, useState } from "react";

/* Renders the page at a fixed desktop size and scales it to fit the pane —
   a mini browser window, so nothing gets cropped no matter the pane size. */
const BASE_W = 1280;
const BASE_H = 832;

export function PreviewPane({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      setScale(Math.min(rect.width / BASE_W, rect.height / BASE_H, 1));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex h-full w-full items-center justify-center">
      <div
        style={{ width: BASE_W * scale, height: BASE_H * scale }}
        className="overflow-hidden rounded-xl shadow-2xl ring-1 ring-black/10"
      >
        <div
          style={{
            width: BASE_W,
            height: BASE_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
