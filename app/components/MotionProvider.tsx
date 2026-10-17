"use client";

import React from "react";
import { MotionConfig } from "motion/react";

/**
 * One reduced-motion policy for every Motion component on the site: under
 * prefers-reduced-motion, transform and layout animations are skipped and
 * only opacity/color ones run. Components add their own crossfades where a
 * skipped morph would otherwise leave nothing (see crossfade in
 * motion-variants.ts). A client wrapper because the root layout is a server
 * component and can't import motion/react directly.
 */
function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export default MotionProvider;
