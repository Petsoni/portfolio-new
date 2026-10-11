"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Check, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { playHaptic } from "@/app/haptics";
import "./MultistateButton.scss";

export type Phase = "idle" | "generating" | "success" | "error";

// Label copy per phase — shown on the button, and announced from the status
// region beside it as the phase changes.
const LABEL_TEXT: Record<Phase, string> = {
  idle: "Generate report",
  generating: "Generating…",
  success: "Report ready",
  error: "Report failed",
};

// Stack order for the label column. Clicks land in idle (start a run) and
// error (retry one); generating and success advance on timers. The simulated
// run itself always succeeds — error is only ever reached by pinning.
const PHASES: Phase[] = ["idle", "generating", "success", "error"];

// Grid geometry lifted from the Figma pattern: 5px squares with 1.5px
// corner radii laid on a 6px pitch (1px gutters).
const CELL = 5;
const PITCH = 6;
const CORNER = 1.5;

// Idle glow reach, as a fraction of the button width: the pattern sits in
// the bottom-left corner and fades out well before the center.
const GLOW_REACH = 0.25;

// Simulated work: click → generating → success → back to idle.
const GENERATING_MS = 2600;
const SUCCESS_MS = 1800;

// While generating, a couple of random cells flash per tick.
const PULSE_TICK_MS = 120;

interface Cell {
  x: number;
  y: number;
  /** Idle visibility, 1 at the bottom-left corner fading to 0 inward. */
  glow: number;
  /** 0..1 distance from the bottom-left corner, for flood/drain timing. */
  spread: number;
  /** 0..1 distance from the button center, for the success/error ripples. */
  mid: number;
}

/** Lay out as many pattern cells as fit the measured button interior. */
function buildCells(width: number, height: number): Cell[] {
  const gap = PITCH - CELL;
  const cols = Math.floor((width + gap) / PITCH);
  const rows = Math.floor((height + gap) / PITCH);
  if (cols < 1 || rows < 1) return [];

  // Center the grid so partial pitches split evenly between the sides.
  const x0 = (width - (cols * PITCH - gap)) / 2;
  const y0 = (height - (rows * PITCH - gap)) / 2;
  // The glow dies out a quarter of the way across (min three cells so it
  // survives on very narrow buttons); spreads normalize against the far
  // (top-right) corner so timing staggers cover the whole field.
  const reach = Math.max(width * GLOW_REACH, PITCH * 3);
  const farthest = Math.hypot(width, height);

  const cells: Cell[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = x0 + col * PITCH + CELL / 2;
      const cy = y0 + row * PITCH + CELL / 2;
      const cornerDist = Math.hypot(cx, height - cy);
      cells.push({
        x: x0 + col * PITCH,
        y: y0 + row * PITCH,
        glow: Math.max(0, 1 - cornerDist / reach),
        spread: cornerDist / farthest,
        mid:
          Math.hypot(
            (cx - width / 2) / (width / 2),
            (cy - height / 2) / (height / 2),
          ) / Math.SQRT2,
      });
    }
  }
  return cells;
}

interface MultistateButtonProps {
  /**
   * Pin the button to a phase for inspection (the demo's state picker drives
   * this); the simulated flow's timers pause while pinned. Null runs free.
   */
  pinnedPhase?: Phase | null;
  /** Fires whenever the button advances itself — a click or a flow timer. */
  onPhaseChange?: (phase: Phase) => void;
}

/**
 * Action button from the Figma design, with the square-grid pattern frame
 * rebuilt as live SVG cells so every square can animate on its own. At rest
 * a subtle patch of squares glows in the bottom-left corner; clicking clears
 * it and random cells flash on the empty field while the (simulated) report
 * generates. On success a single green ripple rolls outward from the center
 * as the label lands on "Report ready"; on error the same wave runs in
 * reverse — a red ripple collapsing into the center — and a click on the
 * failed button retries the run.
 */
function MultistateButton({
  pinnedPhase = null,
  onPhaseChange,
}: MultistateButtonProps) {
  const [ownPhase, setOwnPhase] = useState<Phase>("idle");
  // A pinned phase overrides the button's own flow wherever it stands.
  const phase = pinnedPhase ?? ownPhase;
  const [size, setSize] = useState({ width: 0, height: 0 });
  const patternRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  // Where the stack just came from. With error branching off the line
  // (success and error both follow generating), a fixed cycle can't place
  // the departing label anymore — so remember it and park it above.
  const previousPhase = useRef(phase);
  useEffect(() => {
    previousPhase.current = phase;
  }, [phase]);

  // Clicks start a run from idle — or retry one from a pinned error.
  const clickable = phase === "idle" || phase === "error";

  // Size the grid to the button interior. The label stack keeps the button
  // at the widest label's width, so state changes never resize the grid.
  useLayoutEffect(() => {
    const pattern = patternRef.current;
    if (!pattern) return;
    const measure = () =>
      setSize({ width: pattern.clientWidth, height: pattern.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(pattern);
    return () => observer.disconnect();
  }, []);

  const cells = useMemo(() => buildCells(size.width, size.height), [size]);

  // Every self-driven move (a click below, or the timers here) lands through
  // onPhaseChange so an outside picker can follow the flow.
  useEffect(() => {
    if (pinnedPhase != null || ownPhase === "idle") return;
    const timer = window.setTimeout(
      () => {
        const next: Phase = ownPhase === "generating" ? "success" : "idle";
        setOwnPhase(next);
        onPhaseChange?.(next);
      },
      ownPhase === "generating" ? GENERATING_MS : SUCCESS_MS,
    );
    return () => window.clearTimeout(timer);
  }, [ownPhase, pinnedPhase, onPhaseChange]);

  // Pulse engine: flash random cells while generating. Works on the DOM
  // directly so a hundred-plus cells don't re-render every tick; each pulse
  // removes its own class when the CSS animation finishes.
  useEffect(() => {
    if (phase !== "generating" || reducedMotion) return;
    const rects = Array.from(
      patternRef.current?.querySelectorAll<SVGRectElement>("rect") ?? [],
    );
    if (rects.length === 0) return;
    const timer = window.setInterval(() => {
      for (let picks = 0; picks < 2; picks++) {
        const rect = rects[Math.floor(Math.random() * rects.length)];
        if (!rect || rect.classList.contains("is-pulsing")) continue;
        rect.classList.add("is-pulsing");
        rect.addEventListener(
          "animationend",
          () => rect.classList.remove("is-pulsing"),
          { once: true },
        );
      }
    }, PULSE_TICK_MS);
    return () => window.clearInterval(timer);
  }, [phase, reducedMotion, cells]);

  // Outcome haptics, mirroring the container morph's landings: the green
  // ripple arrives with the success buzz, the red collapse with the error
  // one — however the phase was reached, timer or pinned.
  useEffect(() => {
    if (phase === "success") playHaptic("success");
    if (phase === "error") playHaptic("error");
  }, [phase]);

  const labels: Record<Phase, React.ReactNode> = {
    idle: LABEL_TEXT.idle,
    generating: LABEL_TEXT.generating,
    success: (
      <>
        <Check size={16} aria-hidden="true" />
        {LABEL_TEXT.success}
      </>
    ),
    error: (
      <>
        <X size={16} aria-hidden="true" />
        {LABEL_TEXT.error}
      </>
    ),
  };

  // The active label sits at rest, the one just shown parks above, and
  // everything else waits below — swaps always march upward.
  const labelAnimation = (label: Phase) => {
    if (label === phase) return { opacity: 1, y: 0, filter: "blur(0px)" };
    return {
      opacity: 0,
      y: reducedMotion ? 0 : label === previousPhase.current ? -7 : 7,
      filter: reducedMotion ? "blur(0px)" : "blur(5px)",
    };
  };

  return (
    <>
      <motion.button
        type="button"
        className="multistate-button"
        data-phase={phase}
        // Working states swallow the click — silence the delegated tap and
        // buzz with it, same as the container morph.
        data-sound={clickable ? undefined : "none"}
        data-haptic={clickable ? undefined : "none"}
        aria-busy={phase === "generating"}
        onClick={() => {
          if (!clickable) return;
          setOwnPhase("generating");
          onPhaseChange?.("generating");
        }}
        whileTap={clickable && !reducedMotion ? { scale: 0.97 } : undefined}
      >
        <span
          className="multistate-button-pattern"
          ref={patternRef}
          aria-hidden="true"
        >
          {cells.length > 0 && (
            <svg width={size.width} height={size.height}>
              {cells.map((cell, index) => (
                <rect
                  key={index}
                  className="multistate-button-cell"
                  x={cell.x}
                  y={cell.y}
                  width={CELL}
                  height={CELL}
                  rx={CORNER}
                  style={
                    {
                      "--glow": cell.glow,
                      "--spread": cell.spread,
                      "--mid": cell.mid,
                    } as React.CSSProperties
                  }
                />
              ))}
            </svg>
          )}
        </span>
        <span className="multistate-button-labels">
          {PHASES.map((label) => (
            <motion.span
              key={label}
              className="multistate-button-label"
              data-label={label}
              aria-hidden={phase !== label}
              initial={false}
              animate={labelAnimation(label)}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: 0.25, ease: "easeOut" }
              }
            >
              {labels[label]}
            </motion.span>
          ))}
        </span>
      </motion.button>
      {/* Announces each phase. A sibling, not the button: a live region on
          the labelled control itself is announced unreliably. Idle is the
          resting state and says nothing. */}
      <p role="status" className="sr-only">
        {phase === "idle" ? "" : LABEL_TEXT[phase]}
      </p>
    </>
  );
}

export default MultistateButton;
