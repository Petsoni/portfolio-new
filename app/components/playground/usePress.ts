"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";

/** Keys that press a button: Enter clicks on the way down, Space on the way up. */
const PRESS_KEYS: ReadonlySet<string> = new Set([" ", "Enter"]);

export interface PressHandlers<T extends HTMLElement> {
  onPointerDown: React.PointerEventHandler<T>;
  onPointerEnter: React.PointerEventHandler<T>;
  onPointerLeave: React.PointerEventHandler<T>;
  onKeyDown: React.KeyboardEventHandler<T>;
  onKeyUp: React.KeyboardEventHandler<T>;
  onBlur: React.FocusEventHandler<T>;
}

/**
 * Pressed state tracked the way native controls do it, rather than with
 * :active. It turns on the instant the pointer goes down (not on release),
 * off while the pointer is dragged away — a release out there doesn't
 * click — and on again when it comes back. It ends on release anywhere on
 * the page, when a touch turns into a scroll (pointercancel), and on blur.
 * Space and Enter press it too.
 *
 * The caller's own handlers in `own` run first, so neither is lost. While
 * `isDisabled` (disabled, or busy loading) nothing presses, and a press in
 * progress lets go.
 */
export function usePress<T extends HTMLElement = HTMLButtonElement>(
  isDisabled = false,
  own: Partial<PressHandlers<T>> = {},
): { isPressed: boolean; pressHandlers: PressHandlers<T> } {
  const [isPressed, setIsPressed] = useState(false);
  const activePointer = useRef<number | null>(null);
  const stopTracking = useRef<(() => void) | null>(null);

  // A button that unmounts mid-press stops listening for the release.
  useEffect(() => () => stopTracking.current?.(), []);

  // Disabled mid-press (a click that starts loading, say): let go.
  useEffect(() => {
    if (!isDisabled) return;
    stopTracking.current?.();
    setIsPressed(false);
  }, [isDisabled]);

  const pressHandlers: PressHandlers<T> = {
    onPointerDown(event) {
      own.onPointerDown?.(event);
      if (isDisabled || event.button !== 0) return;

      // Touch pointers are captured by the element they land on, which
      // would hide the finger sliding off it. Released, a touch reports
      // leave and enter like a mouse, so dragging off lets go there too.
      const target = event.currentTarget;
      if (target.hasPointerCapture(event.pointerId)) {
        target.releasePointerCapture(event.pointerId);
      }

      stopTracking.current?.();
      activePointer.current = event.pointerId;
      setIsPressed(true);

      // The release can land anywhere on the page.
      const release = (pointerEvent: PointerEvent) => {
        if (pointerEvent.pointerId === activePointer.current) {
          stopTracking.current?.();
        }
      };
      window.addEventListener("pointerup", release);
      window.addEventListener("pointercancel", release);
      stopTracking.current = () => {
        window.removeEventListener("pointerup", release);
        window.removeEventListener("pointercancel", release);
        activePointer.current = null;
        stopTracking.current = null;
        setIsPressed(false);
      };
    },
    onPointerEnter(event) {
      own.onPointerEnter?.(event);
      if (event.pointerId === activePointer.current) setIsPressed(true);
    },
    onPointerLeave(event) {
      own.onPointerLeave?.(event);
      if (event.pointerId === activePointer.current) setIsPressed(false);
    },
    onKeyDown(event) {
      own.onKeyDown?.(event);
      if (!isDisabled && PRESS_KEYS.has(event.key) && !event.repeat) {
        setIsPressed(true);
      }
    },
    onKeyUp(event) {
      own.onKeyUp?.(event);
      if (PRESS_KEYS.has(event.key)) setIsPressed(false);
    },
    onBlur(event) {
      own.onBlur?.(event);
      if (activePointer.current === null) setIsPressed(false);
    },
  };

  return { isPressed, pressHandlers };
}
