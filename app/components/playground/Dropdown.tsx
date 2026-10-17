"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  Variants,
} from "motion/react";
import { playHaptic } from "@/app/haptics";
import { crossfade } from "@/app/motion-variants";
import "./Dropdown.scss";

// Same pairing the experience morph uses: a springy open, a calmer close so
// the collapsing panel doesn't wobble under the trigger.
const openSpring = {
  type: "spring" as const,
  stiffness: 320,
  damping: 27,
  mass: 0.9,
};

const closeSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 34,
  mass: 0.9,
};

// Typeahead: keys typed closer together than this build one search prefix.
const TYPEAHEAD_RESET_MS = 500;

// A key that types a character. Space is left out on purpose: on a button it
// activates, so in the list it always selects the highlighted option.
const isTypeaheadKey = (event: React.KeyboardEvent) =>
  event.key.length === 1 &&
  event.key !== " " &&
  !event.ctrlKey &&
  !event.metaKey &&
  !event.altKey;

interface DropdownProps {
  /** Visible label; also names the trigger and the listbox. */
  label: string;
  options: string[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

/**
 * Select control implemented from the two-state Figma design: a white pill
 * that grows a soft panel around itself when opened. The trigger never moves —
 * the panel's chrome fades in around it while the option list springs open
 * below.
 *
 * Keyboard follows the WAI-ARIA listbox pattern: Enter, Space or the arrows
 * open it with the highlight on the selected option; arrows, Home and End
 * move the highlight; typing jumps to a match; Enter or Space selects;
 * Escape closes back to the trigger; Tab closes and moves on. Two states stay
 * visibly apart: the selected option carries the check, the highlighted one
 * (DOM focus — hover moves it too) carries the fill and the focus ring.
 */
function Dropdown({ label, options, defaultValue, onChange }: DropdownProps) {
  const [value, setValue] = useState(defaultValue ?? options[0]);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const labelId = `${id}-label`;
  const valueId = `${id}-value`;
  const listId = `${id}-list`;
  const reducedMotion = useReducedMotion();

  const optionElements = () =>
    Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ??
        [],
    );

  // Light dismiss: pointer down anywhere outside closes without selecting.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Listbox convention: the highlight starts on the selected option when the
  // list opens — unless a typeahead key opened it, which names its own.
  const highlightOnOpen = useRef<string | null>(null);
  useEffect(() => {
    if (!open) return;
    const target = highlightOnOpen.current ?? value;
    highlightOnOpen.current = null;
    optionElements()[options.indexOf(target)]?.focus();
    // Keyed on `open` alone: only the open transition moves the highlight
    // (selecting closes the list, so `value` never changes under it).
  }, [open]);

  // Typeahead: one letter (or the same letter repeated) steps through the
  // options that start with it, beginning after `from`; several different
  // letters in quick succession search for that prefix, `from` included.
  const typeahead = useRef({ prefix: "", timer: 0 });
  useEffect(() => {
    const state = typeahead.current;
    return () => window.clearTimeout(state.timer);
  }, []);
  const typeaheadMatch = (key: string, from: number) => {
    const state = typeahead.current;
    window.clearTimeout(state.timer);
    state.prefix += key.toLowerCase();
    state.timer = window.setTimeout(() => {
      state.prefix = "";
    }, TYPEAHEAD_RESET_MS);

    const stepping = [...state.prefix].every((char) => char === state.prefix[0]);
    const prefix = stepping ? state.prefix[0] : state.prefix;
    const start = stepping ? from + 1 : Math.max(from, 0);
    const ordered = [...options.slice(start), ...options.slice(0, start)];
    return ordered.find((option) => option.toLowerCase().startsWith(prefix));
  };

  const close = (focusTrigger: boolean) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  };

  const select = (option: string) => {
    setValue(option);
    onChange?.(option);
    close(true);
  };

  const onTriggerKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
    } else if (!open && isTypeaheadKey(event)) {
      // Typing on the closed trigger opens straight onto the match.
      const match = typeaheadMatch(event.key, options.indexOf(value));
      if (!match) return;
      highlightOnOpen.current = match;
      setOpen(true);
    }
  };

  const onListKeyDown = (event: React.KeyboardEvent) => {
    const items = optionElements();
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    // Each keyboard move ticks like an iOS picker; a no-op (Home while
    // already first) stays silent.
    const focusAt = (i: number) => {
      const next = (i + items.length) % items.length;
      if (next !== index) playHaptic("selection");
      items[next]?.focus();
    };

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusAt(index + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusAt(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusAt(0);
        break;
      case "End":
        event.preventDefault();
        focusAt(items.length - 1);
        break;
      case "Escape":
        close(true);
        break;
      case "Tab":
        // Let focus move on naturally, just don't leave the list hanging
        // open. The options are not tab stops, so focus leaves the dropdown.
        setOpen(false);
        break;
      default:
        if (isTypeaheadKey(event)) {
          const match = typeaheadMatch(event.key, index);
          if (match) focusAt(options.indexOf(match));
        }
    }
  };

  // Hover moves the highlight (focus), so pointer and keyboard never show
  // two highlights at once. pointermove, not pointerenter: an option sliding
  // under a resting pointer as the list springs open must not grab it.
  const onOptionPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== "mouse") return;
    if (document.activeElement !== event.currentTarget) {
      event.currentTarget.focus({ preventScroll: true });
    }
  };

  // The clip drives the panel growth; its height spring is what makes the
  // grey panel look like it stretches open beneath the trigger. Under
  // reduced motion nothing grows: the list takes its full height at once and
  // crossfades, as one.
  const clipVariants: Variants = reducedMotion
    ? {
        hidden: { height: "auto", marginTop: 8, opacity: 0 },
        visible: {
          height: "auto",
          marginTop: 8,
          opacity: 1,
          transition: crossfade,
        },
        exit: {
          height: "auto",
          marginTop: 8,
          opacity: 0,
          transition: crossfade,
        },
      }
    : {
        hidden: { height: 0, opacity: 0, marginTop: 0 },
        visible: {
          height: "auto",
          opacity: 1,
          marginTop: 8,
          transition: {
            height: openSpring,
            marginTop: openSpring,
            opacity: { duration: 0.2 },
            staggerChildren: 0.03,
            delayChildren: 0.05,
          },
        },
        exit: {
          height: 0,
          opacity: 0,
          marginTop: 0,
          transition: {
            height: closeSpring,
            marginTop: closeSpring,
            opacity: { duration: 0.15 },
          },
        },
      };

  // Options bloom in with the site's blur-stagger signature. Not under
  // reduced motion — there the clip's crossfade carries the whole list.
  const optionVariants: Variants | undefined = reducedMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 6, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.25, ease: "easeOut" },
        },
        exit: { opacity: 0, transition: { duration: 0.1, ease: "easeOut" } },
      };

  // The frame springs between the trigger's box (inset 5) and the panel's
  // edge (inset 0). Under reduced motion it never moves: it keeps the panel's
  // geometry and only its fill and border crossfade (CSS) — closed, it is
  // transparent, so where it sits doesn't show.
  const chromeExpanded = open || reducedMotion;
  const chromeInset = chromeExpanded ? 0 : 5;

  return (
    <div className="dropdown-field">
      <span className="dropdown-label" id={labelId}>
        {label}
      </span>
      <div className="dropdown" ref={rootRef}>
        {/*
          The panel is a static 5px spacer around the trigger (-5 + 5 = 0), so
          the trigger's layout never depends on an animated value — it can't
          move or resize. The chrome is a purely decorative layer behind it
          that springs from the trigger's exact box (inset 5) to the panel's
          edge (inset 0), so the frame visibly grows out of the pill. Spring
          overshoot is harmless here: nothing else reads the chrome's geometry.
        */}
        <div className="dropdown-panel" data-open={open}>
          <motion.div
            className="dropdown-chrome"
            aria-hidden="true"
            initial={false}
            animate={{
              top: chromeInset,
              right: chromeInset,
              bottom: chromeInset,
              left: chromeInset,
              borderRadius: chromeExpanded ? 16 : 12,
            }}
            transition={open ? openSpring : closeSpring}
          />
          <button
            type="button"
            ref={triggerRef}
            className="dropdown-trigger"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listId}
            // Label first, then the current value: "Discipline, Software
            // Development" — the value alone doesn't say what is being chosen.
            aria-labelledby={`${labelId} ${valueId}`}
            data-sound="focus"
            onClick={() => setOpen(!open)}
            onKeyDown={onTriggerKeyDown}
          >
            <span className="dropdown-value" id={valueId}>
              {value}
            </span>
            <motion.span
              className="dropdown-chevron"
              aria-hidden="true"
              animate={{ rotate: open ? 180 : 0 }}
              transition={
                reducedMotion ? { duration: 0 } : open ? openSpring : closeSpring
              }
            >
              <ChevronDown size={20} />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                className="dropdown-list-clip"
                variants={clipVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div
                  className="dropdown-list"
                  role="listbox"
                  id={listId}
                  aria-labelledby={labelId}
                  ref={listRef}
                  onKeyDown={onListKeyDown}
                >
                  {options.map((option) => (
                    <motion.button
                      type="button"
                      key={option}
                      role="option"
                      className="dropdown-option"
                      aria-selected={option === value}
                      // Not tab stops: the highlight roves with the arrows,
                      // and Tab leaves the dropdown.
                      tabIndex={-1}
                      data-sound="tick"
                      data-haptic="selection"
                      variants={optionVariants}
                      onClick={() => select(option)}
                      onPointerMove={onOptionPointerMove}
                    >
                      {option}
                      {option === value && (
                        <Check
                          className="dropdown-check"
                          size={16}
                          aria-hidden="true"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Dropdown;
