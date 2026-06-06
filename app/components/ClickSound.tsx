"use client";

import { useClickSound } from "@/app/hooks/useClickSound";

export default function ClickSound() {
  useClickSound({ pattern: "rigid" });
  return null;
}
