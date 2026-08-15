"use client";

import React, { useState } from "react";
import workHistory from "@/lib/work-history.json";
import { MotionConfig, motion } from "motion/react";
import { containerVariants, itemVariants } from "@/app/motion-variants";
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
      <motion.section
        className="section experience-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 variants={itemVariants}>Experience</motion.h2>
        <motion.div className="experience-list">
          {(workHistory as WorkModel[]).map((work) => (
            <motion.button
              type="button"
              className={"experience-row"}
              key={work.id}
              variants={itemVariants}
              layoutId={workLayoutId(work.id)}
              style={{ borderRadius: 8 }}
              // Calm return spring: the row leads the close morph, while the
              // card's bouncier morphSpring still drives the open.
              transition={{ layout: returnSpring }}
              onClick={() => setSelected(work)}
              aria-haspopup="dialog"
            >
              <span className={"experience-name"}>{work.title}</span>
              <span className="separator"></span>
              <span className={"experience-duration"}>{work.duration}</span>
            </motion.button>
          ))}
        </motion.div>
        <ExperienceModal work={selected} onClose={() => setSelected(null)} />
      </motion.section>
    </MotionConfig>
  );
}

export default Experience;
