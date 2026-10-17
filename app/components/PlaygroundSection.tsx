"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { playgroundMorphId, returnSpring } from "@/app/motion-variants";
import { playgroundItems } from "@/lib/playground";

function PlaygroundSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="playground"
      className="section experience-section enter"
      style={{ "--i": 5 } as React.CSSProperties}
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
                title on navigation (and back again) — except under reduced
                motion, where the pairing is dropped and nothing flies. */}
            <motion.span
              className="experience-name"
              layoutId={
                reducedMotion ? undefined : playgroundMorphId(item.id)
              }
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
  );
}

export default PlaygroundSection;
