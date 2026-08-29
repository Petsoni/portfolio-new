"use client";

import { useEffect } from "react";
import { defineSound, ensureReady, type SoundDefinition } from "@web-kits/audio";
import { tap, hover, send, swoosh, focus, tick, expand, collapse } from "@/.web-kits/core";
import { playHaptic } from "@/app/haptics";
import {
  attachHapticOverlays,
  supportsHapticOverlay,
} from "@/app/haptics-overlay";

// All play functions must come from "@web-kits/audio" (not "/react"):
// each entry point bundles its own private AudioContext, so unlocking the
// context from one entry while playing through the other leaves all sounds
// muted until the browser happens to allow a resume() inside a click.
const playClick = defineSound(tap);
const playHover = defineSound(hover);

// Per-element click-sound overrides, opted into with data-sound="<name>",
// e.g. <a data-sound="swoosh">. Unknown names fall back to the default tap.
const clickSounds: Record<string, (() => unknown) | null> = {
  send: defineSound(send),
  swoosh: defineSound(swoosh),
  // Page-transition pair: drilling into a showcase page vs. backing out.
  expand: defineSound(expand),
  collapse: defineSound(collapse),
  focus: defineSound(focus),
  tick: defineSound(tick),
  // Suppresses the default tap for elements whose feedback is played
  // elsewhere (e.g. a modal trigger whose open sound comes from the modal).
  none: null,
};

// Hover-sound discipline: the blip commits only after the pointer has rested
// on the element (transit isn't intent), and consecutive blips keep a minimum
// spacing so scanning a list ticks calmly instead of machine-gunning.
const HOVER_DWELL_MS = 80;
const HOVER_MIN_GAP_MS = 150;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Plays a one-off UI sound outside the click/hover delegation, e.g. from a
 * state-change effect. Honors `prefers-reduced-motion` like all hook sounds
 * and routes through the same AudioContext the hook unlocks.
 */
export function playUiSound(definition: SoundDefinition) {
  if (prefersReducedMotion()) return;
  defineSound(definition)();
}

type UseUiSoundsOptions = {
  /** CSS selector for the elements that play click/hover sounds. */
  selector?: string;
  /** CSS selector for the elements that fire a haptic on click (buttons only by default). */
  hapticSelector?: string;
  /** Disable the hover blip while keeping click sounds and haptics. */
  hoverEnabled?: boolean;
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
 * Hover sounds are mouse-only and deliberately reticent: the blip plays only
 * after the pointer rests on an element for HOVER_DWELL_MS, with at least
 * HOVER_MIN_GAP_MS between blips, so cursor sweeps across the page stay quiet.
 * Pages can opt out of hover entirely with `hoverEnabled: false` (currently
 * everything except the homepage) while keeping click sounds and haptics.
 *
 * Button clicks additionally fire a web-haptics buzz — "rigid" by default,
 * swapped per element with data-haptic="<preset>" ("none" silences it) — so
 * supported devices vibrate. All sounds respect the user's
 * `prefers-reduced-motion` preference.
 */
export function useUiSounds({
  selector = 'button, a, [role="button"]',
  hapticSelector = 'button, [role="button"]',
  hoverEnabled = true,
  enabled = true,
}: UseUiSoundsOptions = {}) {
  useEffect(() => {
    if (!enabled) return;

    let disposed = false;
    let audioCtx: AudioContext | null = null;

    // On iOS, press haptics come from native switch overlays laid inside
    // the buttons (see haptics-overlay.ts): Apple closed the programmatic
    // path in iOS 26.5, and on older versions it would double the overlay's
    // tick. The delegated playHaptic below stands down there.
    const overlayHaptics = supportsHapticOverlay();
    const detachOverlays = attachHapticOverlays(hapticSelector);

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
        if (override && override in clickSounds) clickSounds[override]?.();
        else playClick();
      }
      // Haptic feedback only for button presses. Like data-sound, elements
      // can swap the preset with data-haptic="<preset>" — "none" silences it.
      const pressed = target?.closest(hapticSelector);
      if (pressed && !overlayHaptics) {
        const haptic = pressed.getAttribute("data-haptic");
        if (haptic !== "none") playHaptic(haptic ?? "rigid");
      }
    };

    let hoverTimer: number | undefined;
    let lastHoverAt = 0;

    const onPointerOver = (event: PointerEvent) => {
      // Mouse pointers only: touch (and pen) taps fire pointerover as part
      // of the tap, which would double every tap with a hover blip.
      if (event.pointerType !== "mouse") return;
      const entered = (event.target as Element | null)?.closest(selector);
      if (!entered) return;
      // Ignore moves between children of the element we're already over.
      const from = (event.relatedTarget as Element | null)?.closest(selector);
      if (from === entered) return;

      window.clearTimeout(hoverTimer);
      hoverTimer = window.setTimeout(() => {
        const now = performance.now();
        if (now - lastHoverAt < HOVER_MIN_GAP_MS) return;
        // Skip while audio is locked: voices scheduled against a suspended
        // context queue on its frozen clock and burst together on resume.
        if (audioCtx?.state !== "running" || prefersReducedMotion()) return;
        lastHoverAt = now;
        playHover();
      }, HOVER_DWELL_MS);
    };

    const onPointerOut = (event: PointerEvent) => {
      // Leaving the element before the dwell elapses cancels the blip.
      const left = (event.target as Element | null)?.closest(selector);
      if (!left) return;
      const to = (event.relatedTarget as Element | null)?.closest(selector);
      if (to !== left) window.clearTimeout(hoverTimer);
    };

    document.addEventListener("click", onClick);
    if (hoverEnabled) {
      document.addEventListener("pointerover", onPointerOver);
      document.addEventListener("pointerout", onPointerOut);
    }
    return () => {
      disposed = true;
      stopUnlocking();
      detachOverlays();
      window.clearTimeout(hoverTimer);
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
    };
  }, [enabled, hoverEnabled, selector, hapticSelector]);
}
