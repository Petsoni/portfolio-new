"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  MotionValue,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { defineSound } from "@web-kits/audio";
import { complete, progressTick } from "@/.web-kits/core";
import { playHaptic } from "@/app/haptics";
import { isSoundEnabled } from "@/app/sound-preference";
import "./Slider.scss";

// Detents sit every 10% — the interior ones marked by ruler ticks, 0% and
// 100% by the track's own edges.
const DETENT_STEP = 10;
const TICKS = Array.from({ length: 9 }, (_, i) => (i + 1) * DETENT_STEP);

// The readout's inset from the track's left edge (the fill's inner padding
// in the Figma design). Mirrored by `left` in Slider.scss.
const VALUE_INSET = 10;

// The track's fixed height (see Slider.scss) and the breathing room between
// the track and the readout when it floats above.
const TRACK_HEIGHT = 40;
const LIFT_GAP = 6;

// The 100% weave — two strands of sparks braiding leftward along crossing
// sine rails, drawn on a canvas that fades in with the max state. Picked
// from the blue prototype rounds (the ChatGPT model selector's energy
// field, translated into this site's quiet register).
const WEAVE_WAVELENGTH = 110; // px per braid cycle — about 3 across the bar
const WEAVE_INK = "#0371dd"; // keep in sync with $max-ink in Slider.scss

interface WeaveSpark {
  x: number;
  y: number;
  r: number;
  /** Which rail — 0 or π, the two crossing phases of the braid. */
  strand: number;
  /** Small fixed offset off the rail, so a strand isn't a string of beads. */
  jitter: number;
  flow: number;
  phase: number;
  twinkle: number;
  a: number;
}

// The Core patch's progress tick, one per magnetic detent, and its
// "complete" chord for landing on 100%. Defined through "@web-kits/audio"
// (not "/react") so they play through the same AudioContext the site's other
// sounds unlock — see useUiSounds for the full story.
const playDetentTick = defineSound(progressTick);
const playMaxChime = defineSound(complete);

// Magnetic hop between detents: stiff and quick, with a hint of life.
const detentSpring = { type: "spring", stiffness: 700, damping: 42 } as const;
// Longer travels — press-jumps and keyboard steps — glide on a softer spring.
const jumpSpring = { type: "spring", stiffness: 420, damping: 36 } as const;
// Free-mode drags chase the pointer through a near-critical spring: tight
// enough to feel 1:1, forgiving enough to absorb the press-jump handoff.
const followSpring = { type: "spring", stiffness: 1200, damping: 80 } as const;
// The readout's hop out of (and back into) the fill — quick, with a little
// life at the top.
const liftSpring = { type: "spring", stiffness: 550, damping: 32 } as const;
// Releasing an overdrag lets the stretch snap home — under-damped on
// purpose, so the material visibly recoils once before settling.
const reboundSpring = { type: "spring", stiffness: 480, damping: 26 } as const;

// Dragging past either end keeps responding, iOS-volume-slider style: the
// whole track stretches from its far edge. Overshoot px run through Apple's
// rubber-band curve, so resistance grows the further you pull and the give
// approaches (never reaches) ELASTIC_RANGE.
const ELASTIC_RANGE = 48;
const ELASTIC_GIVE = 0.55;
const rubberband = (overshoot: number) =>
  (overshoot * ELASTIC_RANGE * ELASTIC_GIVE) /
  (ELASTIC_RANGE + ELASTIC_GIVE * Math.abs(overshoot));

const clamp = (value: number) => Math.min(100, Math.max(0, value));
const nearestDetent = (value: number) =>
  clamp(Math.round(value / DETENT_STEP) * DETENT_STEP);

/**
 * One ruler tick. It fades out just before the fill's edge reaches it, so no
 * half-covered sliver ever pokes past the edge (ticks and fill share a color).
 */
function SliderTick({
  pct,
  fillPct,
}: {
  pct: number;
  fillPct: MotionValue<number>;
}) {
  const opacity = useTransform(fillPct, [pct - 2.4, pct - 0.8], [1, 0]);
  return (
    <motion.span
      className="slider-tick"
      style={{ left: `${pct}%`, opacity }}
      aria-hidden="true"
    />
  );
}

interface SliderProps {
  /** Magnetic mode: the fill snaps between 10% detents while you drag. */
  snap?: boolean;
  /** Starting value, 0–100. */
  defaultValue?: number;
  /** Accessible name for the slider. */
  label?: string;
}

/**
 * Percentage slider from the Figma design: a bordered track with a ruler of
 * ticks and a gray fill whose leading edge is the handle. Press or drag
 * anywhere to move it — the readout inside the fill counts along, and hops
 * above the track when the edge crowds it. In snap mode the fill moves
 * between 10% detents with a magnetic spring, a soft tick, and a haptic.
 * Landing on 100% tints the bar blue and wakes a braided weave of sparks
 * drifting through the fill until the value drops again.
 */
function Slider({
  snap = false,
  defaultValue = 45,
  label = "Percentage",
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLParagraphElement>(null);
  const weaveRef = useRef<HTMLCanvasElement>(null);
  const draggingRef = useRef(false);
  // Mirror of `value` for pointer handlers and effects, so they never read a
  // stale render's value mid-drag.
  const valueRef = useRef(defaultValue);
  const [value, setValue] = useState(defaultValue);
  // Reactive twin of draggingRef — keeps the handle visible via the track's
  // data attribute even when pointer capture carries the drag off-element.
  const [dragging, setDragging] = useState(false);
  const reducedMotion = useReducedMotion();

  // The fill's width in percent — the single source of truth every visual
  // reads from: the fill itself, the counting readout, the readout's lift,
  // and the ticks ducking under the edge.
  const fillPct = useMotionValue(defaultValue);
  const fillWidth = useMotionTemplate`${fillPct}%`;
  // The fill's 8px right rounding eases into the track's 12px as it closes
  // in on the far edge, so the corners meet flush at 100%.
  const fillRadius = useTransform(fillPct, [96, 100], [8, 12]);
  // The hover handle straddles the fill's leading edge, clamped just inside
  // the track's rounding at the extremes so it never spills past a corner.
  const handleLeft = useMotionTemplate`clamp(8px, ${fillPct}%, calc(100% - 8px))`;

  // The readout counts along with the live edge, not the target — a keyboard
  // jump from 45% to 100% rolls the number up as the fill glides.
  const readout = useTransform(fillPct, (v) => `${Math.round(v)}%`);

  // Track and readout sizes for the lift math below.
  const sizesRef = useRef({ track: 0, readout: 0, readoutHeight: 0 });

  // Elastic overdrag: rubber-banded px of stretch past either end. The
  // chrome (border, background, and everything clipped inside) scales from
  // the edge opposite the pull — past 100% it anchors left, past 0% right —
  // thinning slightly as it stretches. Positive is stretch; the rebound
  // spring's overshoot swings it briefly negative, which reads as a squash.
  const stretch = useMotionValue(0);
  // 0 = anchored at the left edge (pulling past max), 1 = at the right.
  const stretchOriginX = useMotionValue(0);
  const stretchScaleX = useTransform(
    stretch,
    (v) => 1 + v / (sizesRef.current.track || 1),
  );
  const stretchScaleY = useTransform(
    stretch,
    [-ELASTIC_RANGE, 0, ELASTIC_RANGE],
    [1.12, 1, 0.88],
  );
  // The readout stays outside the stretching chrome so its glyphs never
  // distort — instead it translates with the material under it: ~1:1 when
  // the left end is the free end, barely at all when the anchor is there.
  const readoutStretchX = useTransform(
    [stretch, stretchOriginX],
    ([v, o]: number[]) => {
      const width = sizesRef.current.track || 1;
      return ((VALUE_INSET - (o === 1 ? width : 0)) / width) * v;
    },
  );

  // When the fill's edge crowds the number, it hops above the track instead
  // of letting the edge run it over — and drops back in once there's room
  // again. The two thresholds overlap (hysteresis) so spring wobble around
  // the boundary can't make it flutter.
  const liftedRef = useRef(false);
  const [lifted, setLifted] = useState(false);
  const updateLift = useCallback(() => {
    const { track, readout: readoutWidth } = sizesRef.current;
    if (!track || !readoutWidth) return;
    const edge = (fillPct.get() / 100) * track;
    const tail = VALUE_INSET + readoutWidth;
    const next = liftedRef.current ? edge < tail + 22 : edge < tail + 10;
    if (next !== liftedRef.current) {
      liftedRef.current = next;
      setLifted(next);
    }
  }, [fillPct]);

  useMotionValueEvent(fillPct, "change", updateLift);

  // At 100% the max state wakes up — blue tint, the spark weave:
  // `maxed` follows the live edge, so it lands the moment the fill arrives,
  // not when the target is set. The threshold is the readout's own rounding
  // boundary — whenever the number says "100%", the bar celebrates. No
  // hysteresis needed: no pointer pixel, keyboard step, or detent can rest
  // exactly on 99.5.
  const maxedRef = useRef(defaultValue >= 99.5);
  const [maxed, setMaxed] = useState(maxedRef.current);
  // The fanfare re-arms only once the fill clearly leaves the max zone, so
  // pixel wiggles across the boundary re-tint the bar but never replay the
  // chord. The visual can afford to be trigger-happy; the sound can't.
  const chimeArmedRef = useRef(true);
  useMotionValueEvent(fillPct, "change", (v) => {
    if (v < 97) chimeArmedRef.current = true;
    const next = v >= 99.5;
    if (next === maxedRef.current) return;
    maxedRef.current = next;
    setMaxed(next);
    if (next && chimeArmedRef.current) {
      chimeArmedRef.current = false;
      // The chord only with sound switched on; the buzz as before.
      if (isSoundEnabled()) playMaxChime();
      if (!reducedMotion) playHaptic("success");
    }
  });

  useEffect(() => {
    const track = trackRef.current;
    const readoutEl = readoutRef.current;
    if (!track || !readoutEl) return;
    const measure = () => {
      sizesRef.current = {
        track: track.clientWidth,
        readout: readoutEl.offsetWidth,
        readoutHeight: readoutEl.offsetHeight,
      };
      updateLift();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    observer.observe(readoutEl); // the number's width changes as it counts
    return () => observer.disconnect();
  }, [updateLift]);

  // The weave engine. The simulation runs for the component's whole life —
  // ticking ~60 dots is negligible, and never pausing means the braid keeps
  // its phase across every exit and re-entry — while CSS opacity shows it
  // only at 100%. Under reduced motion it renders a single still frame.
  useEffect(() => {
    const canvas = weaveRef.current;
    const track = trackRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !track || !ctx) return;

    const reducedMotionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;
    let sec = 0;
    let sparks: WeaveSpark[] = [];

    const tick = (dt: number) => {
      sec += dt;
      const cy = h / 2;
      const amp = (h - 14) / 2;
      const k = (Math.PI * 2) / WEAVE_WAVELENGTH;
      for (const p of sparks) {
        p.x -= p.flow * dt;
        if (p.x < -3) p.x += w + 6;
        // The rail is a function of x, so the strand shape holds still while
        // sparks ride through it — a braid, not a wiggling snake.
        p.y = cy + Math.sin(p.x * k + p.strand + p.jitter) * amp;
        // Mild shimmer only — heavy twinkling would break the rails apart.
        const s = 0.5 + 0.5 * Math.sin(sec * p.twinkle + p.phase);
        p.a = 0.28 + 0.2 * s * s;
      }
    };

    const render = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = WEAVE_INK;
      for (const p of sparks) {
        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const seed = () => {
      w = track.clientWidth;
      h = track.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      // Rail perception needs dots dense along the curve (~12px apart per
      // strand); quietness comes from keeping them small and faint.
      const count = Math.max(36, Math.round(w / 6));
      sparks = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: 0,
        r: 0.8 + Math.random() * 0.4,
        strand: i % 2 === 0 ? 0 : Math.PI,
        jitter: (Math.random() - 0.5) * 0.24,
        flow: 52 + Math.random() * 18,
        phase: Math.random() * Math.PI * 2,
        twinkle: 1 + Math.random() * 1.6,
        a: 0,
      }));
      // Warm the field up so it's already mid-flow when first revealed (and
      // so a single rendered frame is a valid reduced-motion still).
      for (let i = 0; i < 90; i++) tick(1 / 50);
    };

    let raf = 0;
    let last = 0;
    const start = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      render();
      if (reducedMotionQuery.matches) return; // the still frame is the state
      last = performance.now();
      const loop = (t: number) => {
        // dt-clamped so uneven frame pacing never teleports the field.
        tick(Math.min(0.032, Math.max(0, (t - last) / 1000)));
        last = t;
        render();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    seed();
    start();
    const observer = new ResizeObserver(() => {
      seed();
      start();
    });
    observer.observe(track);
    reducedMotionQuery.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      reducedMotionQuery.removeEventListener("change", start);
    };
  }, []);

  // Lifted, the readout's center moves from the track's middle to just above
  // its top edge.
  const liftY = -(TRACK_HEIGHT / 2 + LIFT_GAP + sizesRef.current.readoutHeight / 2);

  // Land on a value with a spring. Detent landings get the stiffer magnetic
  // spring plus the ratchet tick; everything else glides.
  const settle = (next: number, opts: { detent?: boolean } = {}) => {
    const target = clamp(next);
    if (target === valueRef.current) return;
    valueRef.current = target;
    setValue(target);
    if (reducedMotion) fillPct.jump(target);
    else animate(fillPct, target, opts.detent ? detentSpring : jumpSpring);
    if (opts.detent) {
      if (isSoundEnabled()) playDetentTick();
      if (!reducedMotion) playHaptic("selection");
    }
  };

  // Free-mode drag: chase the pointer 1:1 through the tight follow spring.
  const follow = (next: number) => {
    const target = clamp(next);
    valueRef.current = target;
    setValue(target);
    if (reducedMotion) fillPct.jump(target);
    else animate(fillPct, target, followSpring);
  };

  // Entering snap mode pulls the value onto its nearest detent — without the
  // tick, the picker's own click is feedback enough.
  useEffect(() => {
    if (!snap) return;
    const target = nearestDetent(valueRef.current);
    if (target === valueRef.current) return;
    valueRef.current = target;
    setValue(target);
    if (reducedMotion) fillPct.jump(target);
    else animate(fillPct, target, detentSpring);
  }, [snap, reducedMotion, fillPct]);

  const pointerX = (event: React.PointerEvent<HTMLDivElement>) => {
    const track = event.currentTarget;
    // clientWidth/clientLeft exclude the 1px border — the same box the
    // fill's percentage width resolves against. The root itself never
    // transforms (the chrome inside it does), so this rect stays honest
    // even mid-stretch.
    const x = event.clientX - track.getBoundingClientRect().left - track.clientLeft;
    return { x, width: track.clientWidth };
  };

  // Overshoot past either end becomes stretch, chased through the same
  // tight spring as the fill: dragging back onto the track unwinds it
  // continuously, and grabbing the slider mid-rebound blends velocities
  // instead of snapping.
  const overdragEngagedRef = useRef(false);
  const overdrag = (x: number, width: number) => {
    if (reducedMotion) return;
    const over = x < 0 ? x : x > width ? x - width : 0;
    if (over === 0 && stretch.get() === 0) return;
    if (over !== 0) stretchOriginX.set(over < 0 ? 1 : 0);
    // Running past an end lands with one soft thunk as the rubber band
    // engages; returning onto the track re-arms it, so a held stretch
    // stays silent.
    if (over !== 0 && !overdragEngagedRef.current) {
      overdragEngagedRef.current = true;
      playHaptic("soft");
    }
    if (over === 0) overdragEngagedRef.current = false;
    animate(stretch, rubberband(Math.abs(over)), followSpring);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    // No explicit focus() here: the tabIndex makes mousedown focus the track
    // natively, and script-initiated focus would wrongly match :focus-visible
    // — pinning the handle and the focus ring after every mouse drag.
    event.currentTarget.setPointerCapture(event.pointerId);
    draggingRef.current = true;
    setDragging(true);
    const { x, width } = pointerX(event);
    const raw = clamp((x / width) * 100);
    if (snap) settle(nearestDetent(raw), { detent: true });
    else settle(raw);
    overdrag(x, width);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    // A release outside the window can go undelivered, leaving a phantom
    // drag: the pointer comes back with no button held but the slider still
    // following it. Treat the first buttonless move as the missed release.
    // (Touch contacts always report a pressed button, so this only ever
    // catches hover-capable pointers.)
    if (event.buttons === 0) {
      endDrag();
      return;
    }
    const { x, width } = pointerX(event);
    const raw = clamp((x / width) * 100);
    if (snap) settle(nearestDetent(raw), { detent: true });
    else follow(raw);
    overdrag(x, width);
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    overdragEngagedRef.current = false;
    // Let go while stretched and the material recoils home.
    if (stretch.get() !== 0) animate(stretch, 0, reboundSpring);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const current = Math.round(valueRef.current);
    const step = snap ? DETENT_STEP : 1;
    let next: number;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = current + step;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = current - step;
        break;
      case "PageUp":
        next = current + DETENT_STEP;
        break;
      case "PageDown":
        next = current - DETENT_STEP;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = 100;
        break;
      default:
        return;
    }
    event.preventDefault();
    if (snap) settle(nearestDetent(next), { detent: true });
    else settle(next);
  };

  return (
    <div
      ref={trackRef}
      className="slider"
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-orientation="horizontal"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      aria-valuetext={`${Math.round(value)}%`}
      data-dragging={dragging || undefined}
      data-maxed={maxed || undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      // The browser drops capture the instant it processes a release, even
      // one it never delivers to us (e.g. off-window) — so this ends the
      // drag right then, not on the pointer's return.
      onLostPointerCapture={endDrag}
      onKeyDown={onKeyDown}
    >
      {/* The elastic body: border, background, and the clipping surface all
          stretch together when a drag runs past an end. The readout lives
          outside it so the number never distorts. */}
      <motion.div
        className="slider-chrome"
        style={{
          scaleX: stretchScaleX,
          scaleY: stretchScaleY,
          originX: stretchOriginX,
        }}
        aria-hidden="true"
      >
        {/* Clipping layer: everything that must stay inside the track's
            rounding. */}
        <div className="slider-surface">
          {TICKS.map((tick) => (
            <SliderTick key={tick} pct={tick} fillPct={fillPct} />
          ))}
          <motion.div
            className="slider-fill"
            style={{
              width: fillWidth,
              borderTopRightRadius: fillRadius,
              borderBottomRightRadius: fillRadius,
            }}
          />
          {/* Max-state weave — the engine effect above draws into this; CSS
              fades it in with data-maxed. */}
          <canvas ref={weaveRef} className="slider-weave" />
          <motion.span className="slider-handle" style={{ left: handleLeft }} />
        </div>
      </motion.div>
      <motion.p
        ref={readoutRef}
        className="slider-value"
        initial={false}
        animate={{ y: lifted ? liftY : 0 }}
        transition={reducedMotion ? { duration: 0 } : liftSpring}
        style={{ x: readoutStretchX }}
        aria-hidden="true"
      >
        {readout}
      </motion.p>
    </div>
  );
}

export default Slider;
