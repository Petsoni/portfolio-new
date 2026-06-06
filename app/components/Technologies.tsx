"use client";

import React from "react";
import techStack from "@/lib/tech-stack.json";
import Image from "next/image";
import {motion} from "motion/react";
import {containerVariants, itemVariants} from "../motion-variants";
import {hapticOnEnter} from "@/app/haptics";

function Technologies() {

  const primaryTech = ["Angular", "React", "Tailwind CSS", "REST APIs", "MySQL", "Spring Boot"]

  return (
    <motion.div
      className="section technologies-section"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div className="section-title" variants={itemVariants} onAnimationStart={hapticOnEnter}>
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
        onAnimationStart={hapticOnEnter}
      >
        {Object.entries(techStack).map((tech) => (
          <motion.div key={tech[0]} className={"chip"}>
            <span className={"chip-inner"}>{tech[0]}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Technologies;
