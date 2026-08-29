// iOS press haptics via the native switch control.
//
// iOS has never shipped navigator.vibrate, and as of iOS 26.5 Apple also
// closed the workaround web-haptics relies on there (programmatically
// clicking a hidden <input switch>). The one thing that still works is a
// real finger landing on a real, natively-rendered switch: the system plays
// its haptic tick for the toggle. So on iOS this module lays an invisible
// switch inside every haptic-eligible button — the tap toggles the switch
// (one native tick) and the click bubbles on to the button's own handlers.
// Styling lives in common.scss under ".haptic-overlay".
//
// What this buys, honestly:
// - Press haptics only, as one fixed system tick — presets don't apply.
// - Anything not born from a tap on the element (slider detents, the
//   timer-driven success/error landings) cannot fire on iOS 26.5+ at all.
//   Android keeps the full preset system through app/haptics.ts.
// - data-haptic="none" hosts stay silent via CSS: the overlay drops
//   pointer-events, so the tap never touches the switch.

const OVERLAY_CLASS = "haptic-overlay";

/**
 * True where the overlay is needed and possible: a touch device without the
 * Vibration API (Android has it and goes through web-haptics instead) whose
 * engine renders the native switch control (WebKit 17.4+). Matches iPads
 * too — they have no vibration hardware, so the overlay is simply inert.
 */
export function supportsHapticOverlay(): boolean {
  if (typeof window === "undefined") return false;
  return (
    !("vibrate" in navigator) &&
    "switch" in document.createElement("input") &&
    window.matchMedia("(pointer: coarse)").matches
  );
}

function attach(host: Element) {
  if (host.querySelector(`:scope > .${OVERLAY_CLASS}`)) return;
  const style = getComputedStyle(host);
  // The overlay positions and sizes against the host's box.
  if (style.position === "static") {
    (host as HTMLElement).style.position = "relative";
  }
  const overlay = document.createElement("input");
  overlay.type = "checkbox";
  // WebKit's switch attribute has no IDL setter in TS's DOM lib; set markup.
  overlay.setAttribute("switch", "");
  overlay.className = OVERLAY_CLASS;
  overlay.tabIndex = -1; // the host button is the real control
  overlay.setAttribute("aria-hidden", "true");
  // Round the *hit area* to the button's own corners — border-radius and
  // overflow on the host only clip paint, leaving square corners tappable.
  overlay.style.clipPath = `inset(0 round ${style.borderTopLeftRadius} ${style.borderTopRightRadius} ${style.borderBottomRightRadius} ${style.borderBottomLeftRadius})`;
  host.append(overlay);
}

/**
 * Lays switch overlays into every current and future match of `selector`.
 * Returns a cleanup that stops watching and removes them. No-op off iOS.
 */
export function attachHapticOverlays(selector: string): () => void {
  if (!supportsHapticOverlay()) return () => {};

  const scan = (root: Element) => {
    if (root.matches(selector)) attach(root);
    for (const el of root.querySelectorAll(selector)) attach(el);
  };
  scan(document.body);

  // New buttons mount constantly (dropdown lists, portaled switchers);
  // watch the tree and dress them as they arrive.
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof Element) scan(node);
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    observer.disconnect();
    for (const el of document.querySelectorAll(`.${OVERLAY_CLASS}`)) {
      el.remove();
    }
  };
}
