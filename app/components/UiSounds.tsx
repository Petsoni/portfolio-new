"use client";

import { useUiSounds } from "@/app/hooks/useUiSounds";

export default function UiSounds({ hover = true }: { hover?: boolean }) {
  useUiSounds({ hoverEnabled: hover });
  return null;
}
