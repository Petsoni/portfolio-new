// Whether UI sounds are on. Off by default: the visitor opts in with the
// SoundToggle, and the choice persists in localStorage. A tiny external
// store rather than React state, so non-React code (the delegated click
// handler, the slider's ticks) can ask at the moment a sound would play.

const STORAGE_KEY = "sound";

// null until the stored choice has been read.
let enabled: boolean | null = null;
const listeners = new Set<() => void>();

function readStored(): boolean {
  // Storage can be missing or throw (private windows, blocked site data).
  // Then sound simply stays off until toggled.
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (enabled === null) enabled = readStored();
  return enabled;
}

export function setSoundEnabled(next: boolean) {
  enabled = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {
    // Not persisted; the choice still holds for this visit.
  }
  for (const listener of listeners) listener();
}

export function subscribeToSound(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
