"use client";

import React from "react";
import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import { playgroundMorphId } from "@/app/motion-variants";
import { returnSpring } from "@/app/components/ExperienceModal";

// One entry per component; each links to its dedicated showcase page.
const playgroundItems = [
  {
    id: "container-morph",
    name: "Container Morph",
    meta: "Morphing payment flow",
    href: "/playground/container-morph",
  },
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
  {
    id: "slider",
    name: "Slider",
    meta: "Magnetic range control",
    href: "/playground/slider",
  },
];

function PlaygroundSection() {
  return (
    // reducedMotion="user" collapses the name-to-title morph to a fade for
    // prefers-reduced-motion users, same as the Experience section.
    <MotionConfig reducedMotion="user">
      <section
        id="playground"
        className="section experience-section enter"
        style={
          {
            // Breathing room when the Back link's /#playground anchor
            // scrolls this section to the top of the viewport.
            scrollMarginTop: "clamp(48px, 12vh, 120px)",
            "--i": 4,
          } as React.CSSProperties
        }
      >
        <h2>Playground</h2>
        <div className="experience-list">
          {playgroundItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="experience-row"
              data-sound="expand"
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
            </Link>
          ))}
        </div>
      </section>
    </MotionConfig>
  );
}

export default PlaygroundSection;
