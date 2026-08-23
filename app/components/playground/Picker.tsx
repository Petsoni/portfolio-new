"use client";

import React, { useId, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import "./Picker.scss";

// Quick, quiet spring — the thumb lands fast with barely a breath of overshoot.
const thumbSpring = {
  type: "spring" as const,
  stiffness: 430,
  damping: 34,
  mass: 0.9,
};

interface PickerOption<T extends string> {
  value: T;
  label: string;
}

interface PickerProps<T extends string> {
  /** Accessible name for the radio group. */
  label: string;
  options: PickerOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/**
 * Segmented picker from the Figma design: a gray pill of flat labels with a
 * white bordered thumb — carrying the tactile shadow — on the active one.
 * The thumb is a shared layout element, so it slides (and stretches) between
 * segments instead of blinking across. Semantics follow the radio-group
 * pattern: one tab stop, arrows move the selection.
 */
function Picker<T extends string>({
  label,
  options,
  value,
  onChange,
}: PickerProps<T>) {
  const groupRef = useRef<HTMLDivElement>(null);
  const thumbId = useId();
  const reducedMotion = useReducedMotion();

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
    onChange(options[next].value);
    groupRef.current
      ?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
      [next]?.focus();
  };

  return (
    <div
      className="picker"
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
            className="picker-option"
            data-sound="focus"
            onClick={() => onChange(option.value)}
          >
            {active && (
              <motion.span
                className="picker-thumb"
                layoutId={thumbId}
                // Inline so Motion scale-corrects the rounding while the
                // thumb stretches between differently sized segments.
                style={{ borderRadius: 52 }}
                transition={reducedMotion ? { duration: 0 } : thumbSpring}
              />
            )}
            <span className="picker-option-label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default Picker;
