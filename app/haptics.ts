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
