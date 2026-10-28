// Near-critically damped spring for return morphs: the experience row taking
// the card back in (the row drives that animation — it becomes the lead
// element when the card exits). Any overshoot there makes the text look
// squished as the box wobbles.
export const returnSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 34,
  mass: 0.9,
};

// Opacity-only transition: what a morph falls back to under reduced motion.
// Mirrors the CSS tokens --duration-enter and --ease-out in global.scss.
export const crossfade = {
  duration: 0.24,
  ease: [0.23, 1, 0.32, 1],
} as const;
