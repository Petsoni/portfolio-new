"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { useHomeEntrance } from "@/app/hooks/useHomeEntrance";

/**
 * Home page shell. On a return from a showcase page (Back link or browser
 * back) the sections skip their one-time entrances, so this shell supplies
 * the ExperienceModal's content fade instead (same values as its contentItem
 * bloom: fade + soft rise + blur, opacity-only for reduced motion), and the
 * returning title morph flies over it. On a hard load or refresh it renders
 * inert and the sections' own entrance choreography plays as usual.
 */
function HomeReturnFade({ children }: { children: React.ReactNode }) {
  const returning = useHomeEntrance() === false;
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="page"
      initial={
        returning
          ? reducedMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 8, filter: "blur(8px)" }
          : false
      }
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.25, ease: "easeOut" },
      }}
    >
      {children}
    </motion.div>
  );
}

export default HomeReturnFade;
