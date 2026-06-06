import { WebHaptics, type HapticInput } from "web-haptics";

let instance: WebHaptics | null = null;

function getHaptics(): WebHaptics | null {
  if (typeof window === "undefined") return null;
  if (!instance) instance = new WebHaptics();
  return instance;
}

/** Fire a haptic. No-op on devices without the Vibration API. */
export function playHaptic(pattern: HapticInput = "selection") {
  getHaptics()?.trigger(pattern);
}

/**
 * `onAnimationStart` handler for motion elements. Fires a haptic tick when the
 * element starts animating into its "visible" (enter) state.
 */
export function hapticOnEnter(definition: unknown) {
  if (definition === "visible") {
    playHaptic("light");
  }
}
