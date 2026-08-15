"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import {
  AMBIENT_LABELS,
  startAmbient,
  type AmbientHandle,
} from "@/lib/ambient";
import type { WidgetRenderProps } from "@/lib/widgets/types";

/* A glass pill that layers a synthesized ambient loop (rain / fan /
   crickets) under whatever music is playing. Starts only on click —
   browsers require a user gesture for audio anyway. */
export function AmbientRender({ config }: WidgetRenderProps<"ambient">) {
  const [on, setOn] = useState(false);
  const handleRef = useRef<AmbientHandle | null>(null);

  useEffect(() => {
    return () => handleRef.current?.stop();
  }, []);

  // If the editor switches the sound while it's playing, restart it.
  useEffect(() => {
    if (handleRef.current && on) {
      handleRef.current.stop();
      handleRef.current = startAmbient(config.sound);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restart only on sound change
  }, [config.sound]);

  function toggle() {
    if (on) {
      handleRef.current?.stop();
      handleRef.current = null;
      setOn(false);
    } else {
      handleRef.current = startAmbient(config.sound);
      setOn(true);
      track("Ambient On", { sound: config.sound });
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs backdrop-blur-sm transition-colors ${
        on
          ? "border-amber-400/50 bg-amber-400/20 text-amber-200"
          : "border-white/10 bg-black/45 text-white/90 hover:bg-black/65"
      }`}
    >
      {AMBIENT_LABELS[config.sound]}
      <span
        className={`h-2 w-2 rounded-full ${on ? "animate-pulse bg-amber-300" : "bg-white/30"}`}
      />
    </button>
  );
}
