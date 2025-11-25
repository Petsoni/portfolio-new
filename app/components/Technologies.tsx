"use client";

import React from "react";
import techStack from "@/lib/tech-stack.json";
import Image from "next/image";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "../motion-variants";

function Technologies() {
  return (
    <motion.div
      className="section technologies-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="section-title" variants={itemVariants}>
        <Image
          className={"w-[2.5rem] h-[2.5rem]"}
          src={"/blue.webp"}
          alt={"Blue splash"}
          width={512}
          height={512}
        />
        <h2>Technologies I use</h2>
      </motion.div>
      <motion.div
        className="flex flex-row flex-wrap gap-3"
        variants={itemVariants}
      >
        {techStack.map((tech) => (
          <motion.p className={"chip shadow-xs"} key={tech}>
            {tech}
          </motion.p>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Technologies;
