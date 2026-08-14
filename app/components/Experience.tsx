"use client";

import React, { useState } from "react";
import workHistory from "@/lib/work-history.json";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "@/app/motion-variants";
import ExperienceModal, { WorkModel } from "@/app/components/ExperienceModal";

function Experience() {
  const [selected, setSelected] = useState<WorkModel | null>(null);

  return (
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
  );
}

export default Experience;
