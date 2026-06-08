"use client";

import React, { useState } from "react";
import workHistory from "@/lib/work-history.json";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "@/app/motion-variants";
import ExperienceModal, { WorkModel } from "@/app/components/ExperienceModal";

function Experience() {
  const [selected, setSelected] = useState<WorkModel | null>(null);

  return (
    <motion.div
      className="section experience-section"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div className="section-title" variants={itemVariants}>
        <Image
          className={"w-[2.5rem] h-[2.5rem]"}
          src={"/purple.webp"}
          alt={"Purple splash"}
          width={512}
          height={512}
        />
        <h2>Experience</h2>
      </motion.div>
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
            <h6 className={"experience-title"}>
              {work.title}
              <ArrowUpRight className="experience-title-icon" size={20} />
            </h6>
            <div className="separator"></div>
            <p className={"experience-duration"}>{work.duration}</p>
          </motion.button>
        ))}
      </motion.div>
      <ExperienceModal work={selected} onClose={() => setSelected(null)} />
    </motion.div>
  );
}

export default Experience;
