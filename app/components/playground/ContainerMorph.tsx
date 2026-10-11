"use client";

import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type Transition,
} from "motion/react";
import { loadingEnd, loadingStart, warning } from "@/.web-kits/core";
import { playHaptic } from "@/app/haptics";
import { playUiSound } from "@/app/hooks/useUiSounds";
import { crossfade } from "@/app/motion-variants";
import "./ContainerMorph.scss";

/**
 * The flow, phase by phase:
 *
 *   idle     the "Pay with card" pill (Figma frame 1)
 *   shrink   the pill collapses into a solid ink dot and slides left into
 *            its seat beside the incoming "Analysing transaction" label
 *   spin     the dot drains into a spinning arc — the spinner runs beside
 *            the label while a light band sweeps the text
 *   fill     the answer has landed: the arc seals shut into a solid dot
 *            again and glides back to centre as the label fades
 *   card     the dot blooms into the details card, text blurs in
 *
 * The card reports whichever outcome the demo has armed: the success receipt,
 * or the declined details — the latter landing with one sharp refusal shake.
 * Clicking the finished card runs the pill morph in reverse for a replay.
 */
type Phase = "idle" | "shrink" | "spin" | "fill" | "card";

export type Outcome = "success" | "declined";

// $gray-950 from the palette, inlined for Motion.
const INK = "#171717";
// Ink at zero alpha: the shell's fill vanishes while the spinner runs, so
// only the SVG arc remains. Swaps to and from this value happen while the
// solid disc covers the shell — never as a visible crossfade.
const INK_CLEAR = "rgba(23, 23, 23, 0)";

// Shell dressing from the Figma "tactile dark" treatment, one box-shadow
// stack: a 1px $gray-900 ring standing in for the border, the glossy inset
// bevel (solid black lower lip, faint white top sheen), and the palette's
// tactile drop shadow underneath.
const SHELL_SHADOW = [
  "inset 0 0 0 1px #3d3d3d",
  "inset 0 -5px 3px rgba(0, 0, 0, 1)",
  "inset 0 2px 3px rgba(255, 255, 255, 0.25)",
  "0 1px 1px rgba(48, 48, 48, 0.04)",
  "0 2px 1px rgba(48, 48, 48, 0.03)",
  "0 3px 1px rgba(48, 48, 48, 0.01)",
  "0 5px 1px rgba(48, 48, 48, 0)",
].join(", ");
// The working state carries no dressing at all. Every layer fades to a
// structure-matched zero so the box-shadow interpolation never jumps.
const SHELL_SHADOW_NONE = [
  "inset 0 0 0 1px rgba(61, 61, 61, 0)",
  "inset 0 -5px 3px rgba(0, 0, 0, 0)",
  "inset 0 2px 3px rgba(255, 255, 255, 0)",
  "0 1px 1px rgba(48, 48, 48, 0)",
  "0 2px 1px rgba(48, 48, 48, 0)",
  "0 3px 1px rgba(48, 48, 48, 0)",
  "0 5px 1px rgba(48, 48, 48, 0)",
].join(", ");

// Spinner geometry, all in the 20x20 viewBox the shell collapses to. The
// disc state strokes so thick it fills the circle solid — pixel-identical
// to the ink shell it replaces — and the ring state is the open arc.
const RING = 20;
const DISC = { r: 5, strokeWidth: 10, pathLength: 1 };
const ARC = { r: 8.25, strokeWidth: 2.5, pathLength: 0.78 };
// Gap between the spinner and the analysing label.
const GAP = 16;
// The pill's radius in the Figma frame. CSS clamps it to half the pill's
// height, so it draws the same pill as the measured radius that replaces it.
const PILL_RADIUS = 70;

// Choreography: collapse, spin, seal, expand.
const SHRINK_MS = 360;
const SPIN_MS = 1600;
const FILL_MS = 320;

// Springs sit just shy of critical damping: one soft settle, no wobble.
// The morph spring is deliberately gentle — the collapse, the slide into
// the seat, and the glide back to centre all ramp in quietly and land with
// a barely-there kiss of overshoot.
const morphSpring: Transition = { type: "spring", stiffness: 200, damping: 25 };
const expandSpring: Transition = { type: "spring", stiffness: 400, damping: 30, mass: 0.9 };
const restartSpring: Transition = { type: "spring", stiffness: 440, damping: 34 };

// Mock receipt shown on the success card (its date row is added at render,
// see `today`), and the decline's factual counterpart — ledger-calm: what
// failed, on which card, and a way out. The card number is masked the way
// receipts mask it: four dots, last four digits.
const MASKED_CARD = "Visa •••• 4242";
const RECEIPT = [
  { label: "Amount", value: "$149.00" },
  { label: "Card", value: MASKED_CARD },
];
const DECLINE_DETAILS = [
  { label: "Reason", value: "Insufficient funds" },
  { label: "Card", value: MASKED_CARD },
];

// "Aug 29, 2026" — the receipt's date format.
const receiptDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

// The declined card's landing gesture: the macOS login "no" — one sharp
// horizontal shake, decaying to rest.
const SHAKE_X = [0, -8, 7, -5, 3, 0];

interface ContainerMorphProps {
  /** Which result the next (or currently open) card reports. */
  outcome?: Outcome;
}

/**
 * Payment control from the Figma design, played as one continuously
 * morphing container: the dark pill collapses into a spinning arc that
 * runs beside a shimmering "Analysing transaction", then the arc seals
 * shut and blooms into the details card. The shell animates its measured
 * size, radius, fill, shadow, and seat between states.
 */
function ContainerMorph({ outcome = "success" }: ContainerMorphProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const reducedMotion = useReducedMotion() ?? false;
  const statusId = useId();

  // A receipt is dated today — in the visitor's time zone, which the server
  // can't know, so the date is filled in after hydration rather than
  // rendered (and mismatched) on the server. The card stays hidden until a
  // payment has run, so the placeholder is never on screen.
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    setToday(receiptDate.format(new Date()));
  }, []);
  const receipt = [...RECEIPT, { label: "Date", value: today ?? "—" }];

  // Until the first click, every container transition is instant — covering
  // the initial measurement pass and any font-metric settling.
  const booted = useRef(false);

  // The pill, analysing, and card layers keep their natural content size;
  // the shell shrink-wraps whichever is active by animating to these
  // measurements.
  const labelRef = useRef<HTMLSpanElement>(null);
  const analyseRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLSpanElement>(null);
  const [pill, setPill] = useState({ width: 0, height: 0 });
  const [analysing, setAnalysing] = useState({ width: 0, height: 0 });
  const [card, setCard] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const label = labelRef.current;
    const analyseEl = analyseRef.current;
    const cardEl = cardRef.current;
    if (!label || !analyseEl || !cardEl) return;
    const measure = () => {
      // Ceil so a fractional text width can never clip its own last pixel.
      setPill({
        width: Math.ceil(label.offsetWidth),
        height: Math.ceil(label.offsetHeight),
      });
      setAnalysing({
        width: Math.ceil(analyseEl.offsetWidth),
        height: Math.ceil(analyseEl.offsetHeight),
      });
      setCard({
        width: Math.ceil(cardEl.offsetWidth),
        height: Math.ceil(cardEl.offsetHeight),
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(label);
    observer.observe(analyseEl);
    observer.observe(cardEl);
    return () => observer.disconnect();
  }, []);

  // Until the first measurement (the server HTML, and the page without JS)
  // the idle label sits in normal flow and the shell wraps it from CSS alone
  // — see [data-ready] in ContainerMorph.scss — so the pill is there from
  // first paint. Once measured, Motion owns the shell's size.
  const ready = pill.width > 0 && analysing.width > 0 && card.width > 0;

  // Timer chain: each working phase hands off to the next. Reduced motion
  // makes the collapse and seal instant but keeps the spinning hold — the
  // wait is information, not decoration.
  useEffect(() => {
    const flow: Partial<Record<Phase, { next: Phase; after: number }>> = {
      shrink: { next: "spin", after: reducedMotion ? 0 : SHRINK_MS },
      spin: { next: "fill", after: SPIN_MS },
      fill: { next: "card", after: reducedMotion ? 0 : FILL_MS },
    };
    const step = flow[phase];
    if (!step) return;
    const timer = window.setTimeout(() => setPhase(step.next), step.after);
    return () => window.clearTimeout(timer);
  }, [phase, reducedMotion]);

  // The spinner mounts with the spin phase and lingers a beat into the
  // card: the shell's fill swaps ink→clear and clear→ink underneath the
  // solid disc, and the linger keeps the swap covered on its last frame.
  const [ringLingering, setRingLingering] = useState(false);
  useEffect(() => {
    if (phase === "spin" || phase === "fill") setRingLingering(true);
    if (phase === "idle") setRingLingering(false);
    if (phase === "card") {
      const timer = window.setTimeout(() => setRingLingering(false), 120);
      return () => window.clearTimeout(timer);
    }
  }, [phase]);
  const ringMounted = phase === "spin" || phase === "fill" || ringLingering;

  // Sound and haptic story, from the Core patch's loading set: a soft rise
  // as the analysis begins, then — as the card opens — the end chime with a
  // success haptic, or the softer warning tone with the error buzz on a
  // decline. The outcome reads through a ref so re-picking it while the
  // card is open can't replay the landing sounds. playUiSound no-ops while
  // sound is switched off, like every sound on the site.
  const outcomeRef = useRef(outcome);
  useEffect(() => {
    outcomeRef.current = outcome;
  }, [outcome]);
  useEffect(() => {
    if (phase === "spin") {
      playUiSound(loadingStart);
      // A light tap hands the payment off to the analysis.
      playHaptic("light");
    }
    if (phase === "card") {
      if (outcomeRef.current === "success") {
        playUiSound(loadingEnd);
        playHaptic("success");
      } else {
        playUiSound(warning);
        playHaptic("error");
      }
    }
  }, [phase]);

  // Reduced motion: the shell can't glide between its shapes, so each new
  // one (pill, ring, card) fades in instead of popping. A layout effect, so
  // the fade's first frame lands together with the snap.
  const shellOpacity = useMotionValue(1);
  const shape = phase === "idle" ? "pill" : phase === "card" ? "card" : "ring";
  useLayoutEffect(() => {
    if (!reducedMotion || !booted.current) return;
    shellOpacity.set(0);
    const fade = animate(shellOpacity, 1, crossfade);
    return () => fade.stop();
  }, [shape, reducedMotion, shellOpacity]);

  const clickable = phase === "idle" || phase === "card";
  const working = phase === "shrink" || phase === "spin";

  // While analysing, the spinner and label sit side by side, centred as a
  // group: the shell takes a seat left of centre by the measured label
  // width. The label itself is a satellite of the stationary button — its
  // centre works out to a constant offset regardless of the text length.
  const seatX = -(GAP + analysing.width) / 2;
  const analyseX = (RING + GAP) / 2;

  const shellTarget =
    phase === "card"
      ? {
          width: card.width,
          height: card.height,
          borderRadius: 20,
          backgroundColor: INK,
          boxShadow: SHELL_SHADOW,
          // Declines land physically: expand first, then the refusal shake.
          x: reducedMotion || outcome === "success" ? 0 : SHAKE_X,
        }
      : phase === "fill"
        ? {
            width: RING,
            height: RING,
            borderRadius: RING / 2,
            backgroundColor: INK_CLEAR,
            boxShadow: SHELL_SHADOW_NONE,
            x: 0,
          }
        : phase === "spin"
          ? {
              width: RING,
              height: RING,
              borderRadius: RING / 2,
              backgroundColor: INK_CLEAR,
              boxShadow: SHELL_SHADOW_NONE,
              x: seatX,
            }
          : phase === "shrink"
            ? {
                width: RING,
                height: RING,
                borderRadius: RING / 2,
                backgroundColor: INK,
                boxShadow: SHELL_SHADOW_NONE,
                x: seatX,
              }
            : {
                // Figma rounds the pill at 70; at 41px tall that clamps to
                // the half-height 20.5 used here, keeping the radius morph
                // tiny.
                width: ready ? pill.width : "auto",
                height: ready ? pill.height : "auto",
                borderRadius: ready ? pill.height / 2 : PILL_RADIUS,
                backgroundColor: INK,
                boxShadow: SHELL_SHADOW,
                x: 0,
              };

  const shellTransition: Transition =
    !booted.current || reducedMotion
      ? { duration: 0 }
      : {
          ...(phase === "card"
            ? expandSpring
            : phase === "idle"
              ? restartSpring
              : morphSpring),
          // The fill never crossfades — both swaps (ink to clear at spin,
          // clear to ink at card) happen under the solid disc.
          backgroundColor: { duration: 0 },
          // The shadow tweens instead of springing — an overshooting spring
          // would flash it darker than its resting value.
          boxShadow: { duration: 0.3, ease: "easeOut" },
          // The slide into the seat and the glide back to centre ride the
          // phase spring like the size does. Only the declined landing
          // overrides x: the shake waits out the expansion, then decays.
          ...(phase === "card" && outcome === "declined"
            ? { x: { delay: 0.3, duration: 0.42, ease: "easeOut" } }
            : {}),
        };

  const labelVisible = phase === "idle";
  const analyseVisible = working;
  const cardVisible = phase === "card";

  const layerAnimation = (visible: boolean) =>
    visible
      ? { opacity: 1, scale: 1, filter: "blur(0px)" }
      : {
          opacity: 0,
          scale: reducedMotion ? 1 : 0.8,
          filter: reducedMotion ? "blur(0px)" : "blur(4px)",
        };

  const layerTransition = (visible: boolean): Transition =>
    visible
      ? {
          duration: 0.22,
          ease: "easeOut",
          // Entering layers wait out the shell's resize before appearing.
          delay: booted.current ? 0.1 : 0,
        }
      : { duration: 0.16, ease: "easeOut" };

  const cardTextAnimation = (delay: number) =>
    cardVisible
      ? {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.3,
            ease: "easeOut" as const,
            delay: reducedMotion ? 0 : delay,
          },
        }
      : {
          opacity: 0,
          y: reducedMotion ? 0 : 5,
          filter: reducedMotion ? "blur(0px)" : "blur(5px)",
          transition: { duration: 0.12, ease: "easeOut" as const },
        };

  // Two separate jobs for assistive tech. The button's name is only ever
  // the action a press performs; what is happening is announced by the
  // status region beside it — a live region on the button itself, with a
  // name that changes under the user, is announced unreliably. The button
  // is described by the status, so the result is read again on re-focus.
  const actionLabel =
    phase !== "card"
      ? "Pay with card"
      : outcome === "success"
        ? "Start over"
        : "Try again";
  const statusText =
    phase === "idle"
      ? ""
      : phase !== "card"
        ? "Analysing transaction"
        : outcome === "success"
          ? `Payment successful. $149.00 paid with Visa ending 4242${
              today ? ` on ${today}` : ""
            }.`
          : "Payment declined. Insufficient funds on Visa ending 4242.";

  return (
    <>
      <motion.button
        type="button"
        className="container-morph"
        aria-label={actionLabel}
        aria-describedby={statusId}
        aria-busy={!clickable}
        aria-disabled={!clickable}
        // Both clicks play the delegated default tap and buzz — same as the
        // other playground buttons; working states swallow the sound and the
        // haptic with the click.
        data-sound={clickable ? undefined : "none"}
        data-haptic={clickable ? undefined : "none"}
        data-ready={ready || undefined}
        whileTap={clickable && !reducedMotion ? { scale: 0.97 } : undefined}
        onClick={() => {
          if (!clickable) return;
          booted.current = true;
          setPhase(phase === "idle" ? "shrink" : "idle");
        }}
      >
        {/* The morphing shell. It clips its own layers (a collapsing pill
            "eats" the last of its blurred label) — which is exactly why the
            analysing label lives outside it, as a sibling below. */}
        <motion.span
          className="container-morph-shell"
          style={{ opacity: shellOpacity }}
          initial={false}
          animate={shellTarget}
          transition={shellTransition}
        >
          <motion.span
            ref={labelRef}
            className="container-morph-label"
            aria-hidden="true"
            initial={false}
            animate={layerAnimation(labelVisible)}
            transition={layerTransition(labelVisible)}
          >
            Pay with card
          </motion.span>

          {/* The spinner: mounted as a solid disc the instant the shell's
              fill clears — pixel-identical, so the swap is invisible — then
              drained into the open arc. Sealing runs the move in reverse. */}
          {ringMounted && (
            <span className="container-morph-ring" aria-hidden="true">
              <svg viewBox={`0 0 ${RING} ${RING}`}>
                <motion.g
                  style={{
                    transformOrigin: `${RING / 2}px ${RING / 2}px`,
                  }}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: reducedMotion ? 0 : 360 }}
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { repeat: Infinity, duration: 0.9, ease: "linear" }
                  }
                >
                  <motion.circle
                    cx={RING / 2}
                    cy={RING / 2}
                    fill="none"
                    strokeLinecap="round"
                    initial={DISC}
                    animate={
                      phase !== "spin"
                        ? DISC
                        : reducedMotion
                          ? { ...ARC, pathLength: 1 }
                          : ARC
                    }
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { duration: 0.26, ease: "easeOut" }
                    }
                  />
                </motion.g>
              </svg>
            </span>
          )}

          <span
            ref={cardRef}
            className="container-morph-card"
            aria-hidden="true"
          >
            <motion.span
              className="container-morph-card-title"
              initial={false}
              animate={cardTextAnimation(0.08)}
            >
              <span
                className="container-morph-card-dot"
                data-outcome={outcome}
              />
              {outcome === "success" ? "Payment successful" : "Payment declined"}
            </motion.span>
            <span className="container-morph-card-rows">
              {(outcome === "success" ? receipt : DECLINE_DETAILS).map(
                (row, index) => (
                  <motion.span
                    key={row.label}
                    className="container-morph-card-row"
                    initial={false}
                    animate={cardTextAnimation(0.14 + index * 0.05)}
                  >
                    <span className="container-morph-card-row-label">
                      {row.label}
                    </span>
                    <span className="container-morph-card-row-value">
                      {row.value}
                    </span>
                  </motion.span>
                ),
              )}
            </span>
            {outcome === "declined" && (
              <motion.span
                className="container-morph-card-hint"
                initial={false}
                animate={cardTextAnimation(0.24)}
              >
                Click to try again
              </motion.span>
            )}
          </span>
        </motion.span>

        {/* The analysing label sits outside the clipping shell, seated right
            of the spinner; the shimmer band only sweeps while the analysis
            actually runs — entering, the label is plain ink. */}
        <motion.span
          ref={analyseRef}
          className={`container-morph-label${
            phase === "spin" ? " container-morph-shimmer" : ""
          }`}
          data-tone="ink"
          aria-hidden="true"
          style={{ x: analyseX }}
          initial={false}
          animate={layerAnimation(analyseVisible)}
          transition={layerTransition(analyseVisible)}
        >
          Analysing transaction
        </motion.span>
      </motion.button>
      <p id={statusId} role="status" className="sr-only">
        {statusText}
      </p>
    </>
  );
}

export default ContainerMorph;
