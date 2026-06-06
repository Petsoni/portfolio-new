"use client";

import { useCallback, useEffect } from "react";
import { useWebHaptics } from "web-haptics/react";
import type { HapticInput } from "web-haptics";

type UseClickSoundOptions = {
  /** CSS selector for the elements that should make a sound on click. */
  selector?: string;
  /** Haptic/sound preset fired on each click. */
  pattern?: HapticInput;
  /** Disable the effect entirely. */
  enabled?: boolean;
};

/**
 * Plays a short click sound (and a haptic on supported devices) whenever an
 * element matching `selector` is clicked anywhere in the document.
 *
 * The sound is produced by web-haptics' built-in synthesized "click", which is
 * only generated when the instance runs with `debug: true`. On devices with the
 * Vibration API it will also vibrate; on desktop it's sound-only.
 */
export function useClickSound({
  selector = 'button, a, [role="button"]',
  pattern = "rigid",
  enabled = true,
}: UseClickSoundOptions = {}) {
  // debug:true initializes the Web Audio click so it plays on every device,
  // not just ones that support the Vibration API.
  const { trigger } = useWebHaptics({ debug: true });

  const play = useCallback(() => trigger(pattern), [trigger, pattern]);

  useEffect(() => {
    if (!enabled) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (target?.closest(selector)) {
        play();
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [enabled, selector, play]);

  return { play };
}
