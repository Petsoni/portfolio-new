"use client";

import React, { useState } from "react";
import workHistory from "@/lib/work-history.json";
import { MotionConfig, motion } from "motion/react";
import ExperienceModal, {
  WorkModel,
  returnSpring,
  workLayoutId,
} from "@/app/components/ExperienceModal";

function Experience() {
  const [selected, setSelected] = useState<WorkModel | null>(null);

  return (
    // reducedMotion="user" collapses the row-to-card morph (and other
    // transforms) to fades for prefers-reduced-motion users. Context reaches
    // the portal'd modal too.
    <MotionConfig reducedMotion="user">
      <section
        className="section experience-section enter"
        style={{ "--i": 3 } as React.CSSProperties}
      >
        <h2>Experience</h2>
        <div className="experience-list">
          {(workHistory as WorkModel[]).map((work) => (
            <motion.button
              type="button"
              className={"experience-row"}
              key={work.id}
              layoutId={workLayoutId(work.id)}
              style={{ borderRadius: 8 }}
              // Calm return spring: the row leads the close morph, while the
              // card's bouncier morphSpring still drives the open.
              transition={{ layout: returnSpring }}
              onClick={() => setSelected(work)}
              aria-haspopup="dialog"
              data-sound="none"
            >
              <span className={"experience-name"}>{work.title}</span>
              <span className="separator"></span>
              <span className={"experience-duration"}>{work.duration}</span>
            </motion.button>
          ))}
        </div>
        <ExperienceModal work={selected} onClose={() => setSelected(null)} />
      </section>
    </MotionConfig>
  );
}

export default Experience;
