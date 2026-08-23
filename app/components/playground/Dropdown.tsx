"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  Variants,
} from "motion/react";
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

interface DropdownProps {
  /** Accessible name for the listbox. */
  label: string;
  options: string[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

/**
 * Select control implemented from the two-state Figma design: a white pill
 * that grows a soft panel around itself when opened. The trigger never moves —
 * the panel's chrome fades in around it while the option list springs open
 * below, so the closed and open states match the mocks exactly.
 */
function Dropdown({ label, options, defaultValue, onChange }: DropdownProps) {
  const [value, setValue] = useState(defaultValue ?? options[0]);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const reducedMotion = useReducedMotion();

  // Light dismiss: pointer down anywhere outside closes without selecting.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Listbox convention: focus lands on the selected option when the list opens.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLButtonElement>('[aria-selected="true"]')
      ?.focus();
  }, [open]);

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
    }
  };

  const onListKeyDown = (event: React.KeyboardEvent) => {
    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ??
        [],
    );
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    const focusAt = (i: number) =>
      items[(i + items.length) % items.length]?.focus();

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
        // Let focus move on naturally, just don't leave the list hanging open.
        setOpen(false);
        break;
    }
  };

  // The clip drives the panel growth; its height spring is what makes the
  // grey panel look like it stretches open beneath the trigger.
  const clipVariants: Variants = {
    hidden: { height: 0, opacity: 0, marginTop: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      marginTop: 8,
      transition: reducedMotion
        ? { duration: 0 }
        : {
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
      transition: reducedMotion
        ? { duration: 0 }
        : {
            height: closeSpring,
            marginTop: closeSpring,
            opacity: { duration: 0.15 },
          },
    },
  };

  // Options bloom in with the site's blur-stagger signature.
  const optionVariants: Variants = {
    hidden: reducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 6, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.25, ease: "easeOut" },
    },
    exit: { opacity: 0, transition: { duration: 0.1, ease: "easeOut" } },
  };

  return (
    <div className="dropdown" ref={rootRef}>
      {/*
        The panel expands out of the trigger: its edges push 5px past the pill,
        the padding and border grow in, and the radius rounds up — all on the
        same spring as the list height. top + borderWidth + padding always sum
        to 0 (-5 + 1 + 4), so the trigger never moves a pixel while the panel
        inflates around it.
      */}
      <motion.div
        className="dropdown-panel"
        data-open={open}
        initial={false}
        animate={{
          top: open ? -5 : 0,
          left: open ? -5 : 0,
          right: open ? -5 : 0,
          padding: open ? 4 : 0,
          borderWidth: open ? 1 : 0,
          borderRadius: open ? 16 : 12,
        }}
        transition={
          reducedMotion ? { duration: 0 } : open ? openSpring : closeSpring
        }
      >
        <button
          type="button"
          ref={triggerRef}
          className="dropdown-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen(!open)}
          onKeyDown={onTriggerKeyDown}
        >
          <span className="dropdown-value">{value}</span>
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
                aria-label={label}
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
                    variants={optionVariants}
                    onClick={() => select(option)}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Dropdown;
