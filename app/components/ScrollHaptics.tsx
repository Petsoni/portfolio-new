"use client";

import { useScrollHaptics } from "@/app/hooks/useScrollHaptics";

export default function ScrollHaptics() {
  useScrollHaptics({ stepPx: 120, pattern: "selection" });
  return null;
}
