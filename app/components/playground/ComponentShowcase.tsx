"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { returnSpring } from "@/app/components/ExperienceModal";
import "./ComponentShowcase.scss";

interface ComponentShowcaseProps {
  title: string;
  description: string;
  /**
   * layoutId shared with this component's playground row (see
   * playgroundMorphId). When set, the row's name morphs into this page's
   * title on navigation.
   */
  morphId?: string;
  /** The stage: a ShowcaseStage holding the live demo. */
  children: React.ReactNode;
}

/**
 * Shared scaffold for a component's dedicated playground page: back link,
 * title, short description, and the stage with the live demo. Every
 * showcased component gets its own page from this. Everything renders
 * visible on the server; the entrance is the CSS .enter stagger.
 */
function ComponentShowcase({
  title,
  description,
  morphId,
  children,
}: ComponentShowcaseProps) {
  return (
    // reducedMotion="user" collapses the title morph to a jump for
    // prefers-reduced-motion users.
    <MotionConfig reducedMotion="user">
      <section className="section component-showcase">
        {/* Anchor to the playground section so the morph target is on
            screen when the reverse flight plays. */}
        <Link
          href="/#playground"
          className="component-showcase-back enter"
          data-sound="collapse"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>
        {/* The morph target: flies in from the playground row's name, so it
            takes no entrance of its own. On a hard load there is no source
            element and it simply renders in place. */}
        <motion.h1
          layoutId={morphId}
          transition={returnSpring}
          style={{ position: "relative", zIndex: 5 }}
        >
          {title}
        </motion.h1>
        <p className="enter" style={{ "--i": 1 } as React.CSSProperties}>
          {description}
        </p>
        {children}
      </section>
    </MotionConfig>
  );
}

export default ComponentShowcase;
