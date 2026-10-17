// The visitor's color theme: follow the system (the default), or a fixed
// Light or Dark picked with the ThemeToggle. A fixed choice is written to
// <html data-theme> — what _theme.scss keys on — and kept in localStorage;
// "system" removes both, and the prefers-color-scheme media query decides.

export type ThemeChoice = "system" | "light" | "dark";

const STORAGE_KEY = "theme";

/**
 * Inline in <head> (see layout.tsx): applies a stored Light or Dark before
 * the first paint, so a visitor who picked one never sees a flash of the
 * other while the page's JavaScript loads.
 */
export const themeInitScript = `try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

// null until the stored choice has been read.
let choice: ThemeChoice | null = null;
const listeners = new Set<() => void>();

function readStored(): ThemeChoice {
  // Storage can be missing or throw (private windows, blocked site data);
  // the theme then simply follows the system.
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

export function getThemeChoice(): ThemeChoice {
  if (typeof window === "undefined") return "system";
  if (choice === null) choice = readStored();
  return choice;
}

export function setThemeChoice(next: ThemeChoice) {
  choice = next;
  const root = document.documentElement;
  if (next === "system") delete root.dataset.theme;
  else root.dataset.theme = next;
  try {
    if (next === "system") window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Not persisted; the choice still holds for this visit.
  }
  for (const listener of listeners) listener();
}

export function subscribeToTheme(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
