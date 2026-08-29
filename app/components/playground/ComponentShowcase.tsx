"use client";

import React, { createContext, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MotionConfig, motion, Variants } from "motion/react";
import {
  containerVariants,
  itemVariants,
  HOME_RETURN_FLAG,
} from "@/app/motion-variants";
import { returnSpring } from "@/app/components/ExperienceModal";
import "./ComponentShowcase.scss";

/**
 * The stage's top bar element, handed down to whichever VariantSwitcher the
 * demo renders. The demo owns the switcher's state, but the design seats the
 * button row above the canvas — so the switcher teleports there by portal.
 */
export const StageBarContext = createContext<HTMLDivElement | null>(null);

interface ComponentShowcaseProps {
  title: string;
  description: string;
  /**
   * Vertical placement of the demo on the canvas. "top" suits demos that
   * expand downward (e.g. the dropdown); "center" suits fixed-size ones.
   */
  align?: "top" | "center";
  /**
   * layoutId shared with this component's playground row (see
   * playgroundMorphId). When set, the row's name morphs into this page's
   * title on navigation while the rest of the page staggers in.
   */
  morphId?: string;
  /**
   * The live demo, rendered centered on the stage's white canvas. A
   * VariantSwitcher among the children lifts itself into the stage bar.
   */
  children: React.ReactNode;
}

// Container for morphing pages: stagger orchestration only. The section must
// not fade or rise as a whole, or it would drag the flying title with it.
const morphContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

/**
 * Shared scaffold for a component's dedicated playground page: back link,
 * title, short description, and the stage from the Figma design — a soft
 * gray frame holding an optional variant-switcher bar and the white canvas
 * with the live demo. Every showcased component gets its own page from this.
 */
function ComponentShowcase({
  title,
  description,
  align = "top",
  morphId,
  children,
}: ComponentShowcaseProps) {
  // The bar node arrives on mount; until then (and on pages whose demo has
  // no switcher) the empty bar row collapses away in CSS.
  const [stageBar, setStageBar] = useState<HTMLDivElement | null>(null);
  // Mark that the next home visit is a return from a showcase (covers the
  // Back link and the browser's back button alike): the homepage skips its
  // one-time entrance and the title can morph back into a visible row.
  useEffect(() => {
    sessionStorage.setItem(HOME_RETURN_FLAG, "1");
  }, []);

  return (
    // reducedMotion="user" collapses the title morph (and the blur-rise
    // entrances) to fades for prefers-reduced-motion users.
    <MotionConfig reducedMotion="user">
      <motion.section
        className="section component-showcase"
        variants={morphId ? morphContainerVariants : containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          {/* Anchor to the playground section so the morph target is on
              screen when the reverse flight plays. */}
          <Link href="/#playground" className="component-showcase-back" data-sound="collapse">
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>
        </motion.div>
        {morphId ? (
          // The morph target: flies in from the playground row's name (no
          // stagger variants — the flight is its entrance). On a hard load
          // there is no source element, so it simply renders in place.
          <motion.h1
            layoutId={morphId}
            transition={returnSpring}
            style={{ position: "relative", zIndex: 5 }}
          >
            {title}
          </motion.h1>
        ) : (
          <motion.h1 variants={itemVariants}>{title}</motion.h1>
        )}
        <motion.p variants={itemVariants}>{description}</motion.p>
        <motion.div
          className="component-showcase-stage"
          variants={itemVariants}
        >
          <div className="component-showcase-stage-bar" ref={setStageBar} />
          <div className="component-showcase-canvas" data-align={align}>
            <StageBarContext.Provider value={stageBar}>
              {children}
            </StageBarContext.Provider>
          </div>
        </motion.div>
      </motion.section>
    </MotionConfig>
  );
}

export default ComponentShowcase;
