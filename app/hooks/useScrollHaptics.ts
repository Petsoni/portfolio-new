"use client";

import { useEffect, useRef } from "react";
import { useWebHaptics } from "web-haptics/react";
import type { HapticInput } from "web-haptics";

type UseScrollHapticsOptions = {
  /** Pixels of scroll between each haptic tick. Larger = fewer ticks. */
  stepPx?: number;
  /** Haptic preset (or pattern) fired on each step. */
  pattern?: HapticInput;
  /** Disable the effect entirely. */
  enabled?: boolean;
};

/**
 * Fires a subtle haptic "tick" every `stepPx` pixels the user scrolls.
 *
 * The Vibration API this relies on is only available on some mobile browsers
 * (notably Android Chrome); on unsupported devices it's a silent no-op.
 */
export function useScrollHaptics({
  stepPx = 120,
  pattern = "selection",
  enabled = true,
}: UseScrollHapticsOptions = {}) {
  const { trigger, isSupported } = useWebHaptics();
  const lastTickAt = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (!enabled || !isSupported) return;

    lastTickAt.current = window.scrollY;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      window.requestAnimationFrame(() => {
        const current = window.scrollY;
        if (Math.abs(current - lastTickAt.current) >= stepPx) {
          lastTickAt.current = current;
          trigger(pattern);
        }
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled, isSupported, stepPx, pattern, trigger]);

  return { isSupported };
}
