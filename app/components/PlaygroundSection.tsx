"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "@/app/motion-variants";

const MotionLink = motion.create(Link);

// One entry per component showcased on the playground page.
const playgroundItems = [
  { id: "dropdown", name: "Dropdown", meta: "Animated select" },
];

function PlaygroundSection() {
  return (
    <motion.section
      className="section experience-section"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.h2 variants={itemVariants}>Playground</motion.h2>
      <motion.div className="experience-list">
        {playgroundItems.map((item) => (
          <MotionLink
            key={item.id}
            href="/playground"
            className="experience-row"
            variants={itemVariants}
            data-sound="swoosh"
          >
            <span className="experience-name">{item.name}</span>
            <span className="separator"></span>
            <span className="experience-duration">{item.meta}</span>
          </MotionLink>
        ))}
      </motion.div>
    </motion.section>
  );
}

export default PlaygroundSection;
