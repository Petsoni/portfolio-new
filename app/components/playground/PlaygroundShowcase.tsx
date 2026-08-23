"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "@/app/motion-variants";
import Dropdown from "@/app/components/playground/Dropdown";

const dropdownOptions = [
  "Software Development",
  "Product Design",
  "Data & Analytics",
  "Marketing",
  "Customer Support",
];

function PlaygroundShowcase() {
  return (
    <>
      <motion.section
        className="section playground-header"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Link href="/" className="playground-back" data-sound="swoosh">
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>
        </motion.div>
        <motion.h1 variants={itemVariants}>Playground</motion.h1>
        <motion.p variants={itemVariants}>
          A growing collection of components built for the fun of it — each one
          implemented from a Figma design and animated with Motion.
        </motion.p>
      </motion.section>

      <motion.section
        className="section playground-demo"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 variants={itemVariants}>Dropdown</motion.h2>
        <motion.p variants={itemVariants}>
          An expanding select. The closed pill grows a soft panel around itself,
          the options bloom in with a blur stagger, and the whole thing is fully
          keyboard-accessible.
        </motion.p>
        <motion.div className="playground-stage" variants={itemVariants}>
          <Dropdown label="Discipline" options={dropdownOptions} />
        </motion.div>
      </motion.section>
    </>
  );
}

export default PlaygroundShowcase;
