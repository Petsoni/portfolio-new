"use client";

import { useSyncExternalStore } from "react";
import { isSoundEnabled, subscribeToSound } from "@/app/sound-preference";

/**
 * The visitor's sound choice as React state. The server (and the first
 * hydration pass) always renders "off", the default; a stored "on" arrives
 * right after hydration without a mismatch.
 */
export function useSoundEnabled(): boolean {
  return useSyncExternalStore(subscribeToSound, isSoundEnabled, () => false);
}
