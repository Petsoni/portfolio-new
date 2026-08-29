"use client";

import React, { useContext, useRef } from "react";
import { createPortal } from "react-dom";
import { playHaptic } from "@/app/haptics";
import { StageBarContext } from "./ComponentShowcase";
import "./VariantSwitcher.scss";

interface VariantSwitcherOption<T extends string> {
  value: T;
  label: string;
}

interface VariantSwitcherProps<T extends string> {
  /** Accessible name for the radio group. */
  label: string;
  options: VariantSwitcherOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/**
 * The stage's variant switcher from the Figma design: a row of equal-width
 * buttons across the top bar, the active one dressed white with the tactile
 * shadow, the rest flat gray. Every button carries the chrome; picking one
 * cross-fades it — in on the new selection, out on the old (a plain CSS
 * opacity transition, no movement). Semantics follow the radio-group
 * pattern: one tab stop, arrows move the selection.
 *
 * Rendered inside a ComponentShowcase, the row teleports itself into the
 * stage bar above the canvas (StageBarContext), so the demo that owns the
 * selection state can render it like any other child.
 */
function VariantSwitcher<T extends string>({
  label,
  options,
  value,
  onChange,
}: VariantSwitcherProps<T>) {
  const stageBar = useContext(StageBarContext);
  const groupRef = useRef<HTMLDivElement>(null);

  // Radio-group keyboard model: arrows select the previous/next option and
  // carry focus with the selection (roving tabindex), Home/End jump the ends.
  const onKeyDown = (event: React.KeyboardEvent) => {
    const index = options.findIndex((option) => option.value === value);
    let next: number;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = (index + 1) % options.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = (index - 1 + options.length) % options.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = options.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    // Keyboard moves don't fire clicks, so the delegated selection buzz
    // is played by hand — and only when the selection actually moves.
    if (next !== index) playHaptic("selection");
    onChange(options[next].value);
    groupRef.current
      ?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
      [next]?.focus();
  };

  const switcher = (
    <div
      className="variant-switcher"
      role="radiogroup"
      aria-label={label}
      ref={groupRef}
      onKeyDown={onKeyDown}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            type="button"
            key={option.value}
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            className="variant-switcher-option"
            data-sound="focus"
            data-haptic="selection"
            onClick={() => onChange(option.value)}
          >
            <span className="variant-switcher-thumb" />
            <span className="variant-switcher-option-label">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );

  return stageBar ? createPortal(switcher, stageBar) : switcher;
}

export default VariantSwitcher;
