"use client";

import { useEffect } from "react";
import { ensureReady } from "@web-kits/audio";
import { useSound } from "@web-kits/audio/react";
import { tap, hover } from "@/.web-kits/minimal";
import { playHaptic } from "@/app/haptics";

type UseUiSoundsOptions = {
  /** CSS selector for the elements that play click/hover sounds. */
  selector?: string;
  /** CSS selector for the elements that fire a haptic on click (buttons only by default). */
  hapticSelector?: string;
  /** Disable all feedback entirely. */
  enabled?: boolean;
};

/**
 * Adds audible feedback to interactive elements using @web-kits/audio:
 * the "tap" and "hover" sounds from the Minimal patch (.web-kits/minimal).
 *
 * Button clicks additionally fire a web-haptics tick, so supported devices
 * vibrate. Both sounds respect the user's `prefers-reduced-motion` preference
 * via `useSound`.
 */
export function useUiSounds({
  selector = 'button, a, [role="button"]',
  hapticSelector = 'button, [role="button"]',
  enabled = true,
}: UseUiSoundsOptions = {}) {
  const playClick = useSound(tap);
  const playHover = useSound(hover);

  useEffect(() => {
    if (!enabled) return;

    // Browsers only let the AudioContext start after a user gesture.
    const unlock = () => {
      void ensureReady();
    };
    window.addEventListener("pointerdown", unlock, { once: true });

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (target?.closest(selector)) playClick();
      // Haptic feedback only for button presses.
      if (target?.closest(hapticSelector)) playHaptic("rigid");
    };

    const onPointerOver = (event: PointerEvent) => {
      const entered = (event.target as Element | null)?.closest(selector);
      if (!entered) return;
      // Ignore moves between children of the element we're already over.
      const from = (event.relatedTarget as Element | null)?.closest(selector);
      if (from === entered) return;
      playHover();
    };

    document.addEventListener("click", onClick);
    document.addEventListener("pointerover", onPointerOver);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointerover", onPointerOver);
    };
  }, [enabled, selector, hapticSelector, playClick, playHover]);
}
