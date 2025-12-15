"use client";

import React from "react";
import workHistory from "@/lib/work-history.json";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "@/app/motion-variants";

function Experience() {
  return (
    <motion.div
      className="section experience-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
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
      <motion.div className="flex flex-col gap-10">
        {workHistory.map((work) => (
          <motion.div
            className={"experience-wrapper"}
            key={work.id}
            variants={itemVariants}
          >
            <div className="experience-header-wrapper">
              <Link href={work.link} target={"_blank"}>
                <h4 className={"experience-title"}>
                  {work.title}
                  <ArrowUpRight size={"24"} />
                </h4>
              </Link>
              <div className="separator"></div>
              <h6>{work.duration}</h6>
            </div>
            <p className={"experience-description"}>{work.description}</p>
            <div className="flex flex-row flex-wrap gap-3">
              {work.roles.map((role, roleIndex) => (
                <p
                  className={"chip-stroked shadow-xs"}
                  key={`${role}-${roleIndex}`}
                >
                  {role}
                </p>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Experience;
