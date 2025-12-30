"use client";

import React from "react";
import projects from "@/lib/projects.json";
import Link from "next/link";
import Image from "next/image";
import {ArrowUpRight, Earth, Github, Globe} from "lucide-react";
import {motion} from "motion/react";
import {containerVariants, itemVariants} from "@/app/motion-variants";

export interface ProjectModel {
  id: number,
  title: string,
  link: string,
  githubLink: string
  techStack: string[],
  description: string,
}

function Projects() {
  return (
    <motion.div
      className="section projects-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="section-title" variants={itemVariants}>
        <Image
          className={"w-[2.5rem] h-[2.5rem]"}
          src={"/red.webp"}
          alt={"Red splash"}
          width={512}
          height={512}
        />
        <h2>Selected projects</h2>
      </motion.div>
      <motion.div className="flex flex-col gap-10">
        {(projects as ProjectModel[]).map((project) => (
          <motion.div
            className={"project-wrapper"}
            key={project.id}
            variants={itemVariants}
          >
            <div className="project-header-wrapper">
              <h4 className={"project-title"}>
                {project.title}
              </h4>
              <div className="separator"></div>
              <div className="flex items-center justify-between gap-2">
                {project.githubLink ? (
                  <Link href={project.githubLink} target={"_blank"}
                        className={"project-link flex items-center justify-center gap-2 p-2"}>
                    <Github size={"24"}/>
                  </Link>) : null}
                {project.link ? (
                  <Link href={project.link} target={"_blank"}
                        className={"project-link flex items-center justify-center p-2 gap-2"}>
                    <Globe size={"24"}/>
                  </Link>) : null}
              </div>
            </div>
            <p className={"project-description"}>{project.description}</p>
            <div className="flex flex-row flex-wrap gap-3">
              {project.techStack.map((technology, technologyIndex) => (
                <p
                  className={"chip-stroked shadow-xs"}
                  key={`${technology}-${technologyIndex}`}
                >
                  {technology}
                </p>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Projects;
