"use client";

import { useEffect } from "react";
import { defineSound, ensureReady } from "@web-kits/audio";
import { tap, hover, send, swoosh } from "@/.web-kits/core";
import { playHaptic } from "@/app/haptics";

// All play functions must come from "@web-kits/audio" (not "/react"):
// each entry point bundles its own private AudioContext, so unlocking the
// context from one entry while playing through the other leaves all sounds
// muted until the browser happens to allow a resume() inside a click.
const playClick = defineSound(tap);
const playHover = defineSound(hover);

// Per-element click-sound overrides, opted into with data-sound="<name>",
// e.g. <a data-sound="swoosh">. Unknown names fall back to the default tap.
const clickSounds: Record<string, () => unknown> = {
  send: defineSound(send),
  swoosh: defineSound(swoosh),
};

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
 * the "tap" and "hover" sounds from the Core patch (.web-kits/core).
 * Individual elements can swap the click sound via data-sound="<name>"
 * for any name registered in `clickSounds`.
 *
 * The AudioContext is unlocked as early as the browser allows: immediately on
 * mount when autoplay is permitted (e.g. returning visitors), otherwise on the
 * first qualifying gesture (pointer, key, or touch — hovering alone can never
 * unlock audio, browsers don't count it as user activation).
 *
 * Button clicks additionally fire a web-haptics tick, so supported devices
 * vibrate. All sounds respect the user's `prefers-reduced-motion` preference.
 */
export function useUiSounds({
  selector = 'button, a, [role="button"]',
  hapticSelector = 'button, [role="button"]',
  enabled = true,
}: UseUiSoundsOptions = {}) {
  useEffect(() => {
    if (!enabled) return;

    let disposed = false;
    let audioCtx: AudioContext | null = null;

    const unlockEvents = ["pointerdown", "keydown", "touchend"] as const;

    const stopUnlocking = () => {
      for (const type of unlockEvents) {
        window.removeEventListener(type, tryUnlock, true);
      }
    };

    const tryUnlock = () => {
      ensureReady()
        .then((context) => {
          if (disposed) return;
          audioCtx = context;
          if (context.state === "running") stopUnlocking();
        })
        .catch(() => {
          // Autoplay still blocked; the next gesture retries.
        });
    };

    // Eager attempt at page load: starts audio right away when the browser
    // allows it. In Chrome the pending resume() from this call also completes
    // automatically at the first user interaction.
    tryUnlock();
    for (const type of unlockEvents) {
      window.addEventListener(type, tryUnlock, { capture: true, passive: true });
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const interactive = target?.closest(selector);
      // No running-state guard here: the click itself unlocks the context,
      // so a voice scheduled during resume plays the instant it completes.
      if (interactive && !prefersReducedMotion()) {
        const override = interactive.getAttribute("data-sound");
        const play = (override && clickSounds[override]) || playClick;
        play();
      }
      // Haptic feedback only for button presses.
      if (target?.closest(hapticSelector)) playHaptic("rigid");
    };

    const onPointerOver = (event: PointerEvent) => {
      // Skip hovers while audio is locked: voices scheduled against a
      // suspended context queue on its frozen clock and would all burst
      // out together the moment it resumes.
      if (audioCtx?.state !== "running" || prefersReducedMotion()) return;
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
      disposed = true;
      stopUnlocking();
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointerover", onPointerOver);
    };
  }, [enabled, selector, hapticSelector]);
}
