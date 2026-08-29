import { WebHaptics, type HapticInput } from "web-haptics";

let instance: WebHaptics | null = null;

function getHaptics(): WebHaptics | null {
  if (typeof window === "undefined") return null;
  if (!instance) instance = new WebHaptics();
  return instance;
}

/**
 * Fire a haptic through the programmatic path: navigator.vibrate on
 * Android, web-haptics' hidden-switch fallback on iOS 17.4–26.4. Apple
 * closed that fallback in iOS 26.5, where this silently no-ops — press
 * haptics there come from the native switch overlays laid into buttons by
 * haptics-overlay.ts instead. No-op on unsupported devices.
 */
export function playHaptic(pattern: HapticInput = "selection") {
  getHaptics()?.trigger(pattern);
}
