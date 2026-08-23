"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "@/app/motion-variants";
import "./ComponentShowcase.scss";

interface ComponentShowcaseProps {
  title: string;
  description: string;
  /** The live demo, rendered centered on the stage. */
  children: React.ReactNode;
}

/**
 * Shared scaffold for a component's dedicated playground page: back link,
 * title, short description, and a bordered stage holding the live demo.
 * Every showcased component gets its own page built from this.
 */
function ComponentShowcase({
  title,
  description,
  children,
}: ComponentShowcaseProps) {
  return (
    <motion.section
      className="section component-showcase"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Link href="/" className="component-showcase-back" data-sound="swoosh">
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>
      </motion.div>
      <motion.h1 variants={itemVariants}>{title}</motion.h1>
      <motion.p variants={itemVariants}>{description}</motion.p>
      <motion.div className="component-showcase-stage" variants={itemVariants}>
        {children}
      </motion.div>
    </motion.section>
  );
}

export default ComponentShowcase;
