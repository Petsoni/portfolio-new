"use client";

import React from "react";
import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import { containerVariants, itemVariants, playgroundMorphId } from "@/app/motion-variants";
import { returnSpring } from "@/app/components/ExperienceModal";
import { useHomeEntrance } from "@/app/hooks/useHomeEntrance";

const MotionLink = motion.create(Link);

// One entry per component; each links to its dedicated showcase page.
const playgroundItems = [
  {
    id: "dropdown",
    name: "Dropdown",
    meta: "Animated select",
    href: "/playground/dropdown",
  },
  {
    id: "multistate-button",
    name: "Multistate Button",
    meta: "Stateful action button",
    href: "/playground/multistate-button",
  },
];

function PlaygroundSection() {
  // One-time entrance: plays on hard load/refresh, skipped when returning
  // from a showcase page — which also gives the returning title morph a
  // fully visible row to fly back into.
  const entrance = useHomeEntrance();

  return (
    // reducedMotion="user" collapses the name-to-title morph to a fade for
    // prefers-reduced-motion users, same as the Experience section.
    <MotionConfig reducedMotion="user">
      <motion.section
        id="playground"
        className="section experience-section"
        // Breathing room when the Back link's /#playground anchor scrolls
        // this section to the top of the viewport.
        style={{ scrollMarginTop: "clamp(48px, 12vh, 120px)" }}
        variants={containerVariants}
        initial={entrance}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 variants={itemVariants}>Playground</motion.h2>
        <motion.div className="experience-list">
          {playgroundItems.map((item) => (
            <MotionLink
              key={item.id}
              href={item.href}
              className="experience-row"
              variants={itemVariants}
              data-sound="swoosh"
            >
              {/* Shared element: this name morphs into the showcase page's
                  title on navigation (and back again). */}
              <motion.span
                className="experience-name"
                layoutId={playgroundMorphId(item.id)}
                transition={returnSpring}
                style={{ position: "relative", zIndex: 5 }}
              >
                {item.name}
              </motion.span>
              <span className="separator"></span>
              <span className="experience-duration">{item.meta}</span>
            </MotionLink>
          ))}
        </motion.div>
      </motion.section>
    </MotionConfig>
  );
}

export default PlaygroundSection;
