"use client";

import React, { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  getThemeChoice,
  setThemeChoice,
  subscribeToTheme,
  type ThemeChoice,
} from "@/app/theme-preference";
import "./ThemeToggle.scss";

const NEXT: Record<ThemeChoice, ThemeChoice> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const LABEL: Record<ThemeChoice, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

/**
 * The color theme switch: one icon button cycling System → Light → Dark.
 * The icon shown is picked in CSS from <html data-theme> (ThemeToggle.scss),
 * which the inline head script sets before paint — so a stored choice shows
 * the right icon from the first frame, with no swap at hydration.
 */
function ThemeToggle() {
  const choice = useSyncExternalStore(
    subscribeToTheme,
    getThemeChoice,
    () => "system" as const,
  );

  return (
    <button
      type="button"
      className="icon-button theme-toggle"
      aria-label={`Color theme: ${LABEL[choice]}`}
      onClick={() => setThemeChoice(NEXT[choice])}
    >
      <Monitor
        className="theme-toggle-icon"
        data-for="system"
        size={16}
        aria-hidden="true"
      />
      <Sun
        className="theme-toggle-icon"
        data-for="light"
        size={16}
        aria-hidden="true"
      />
      <Moon
        className="theme-toggle-icon"
        data-for="dark"
        size={16}
        aria-hidden="true"
      />
    </button>
  );
}

export default ThemeToggle;
