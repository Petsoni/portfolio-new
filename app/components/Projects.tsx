"use client";

import React, { useEffect, useState } from "react";
import projects from "@/lib/projects.json";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Earth, EllipsisVertical, Github, Globe } from "lucide-react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "@/app/motion-variants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ProjectModel {
  id: number,
  title: string,
  link: string,
  githubLink: string
  techStack: string[],
  description: string,
}

function Projects() {
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    document.body.classList.toggle("dropdown-spotlight", openId !== null);
    return () => document.body.classList.remove("dropdown-spotlight");
  }, [openId]);

  return (
    <motion.div
      className="section projects-section"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
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
            className={`project-wrapper${openId === project.id ? " is-focused" : ""}`}
            key={project.id}
            variants={itemVariants}
          >
            <div className="project-header-wrapper">
              <h4 className={"project-title"}>
                {project.title}
              </h4>
              <div className="separator"></div>
              <div className="flex items-center justify-between gap-2 max-[768px]:hidden">
                {project.githubLink ? (
                  <Link href={project.githubLink} target={"_blank"}
                    className={"project-link flex items-center justify-center gap-2 p-2"}>
                    <Github size={"24"} />
                  </Link>) : null}
                {project.link ? (
                  <Link href={project.link} target={"_blank"}
                    className={"project-link flex items-center justify-center p-2 gap-2"}>
                    <Globe size={"24"} />
                  </Link>) : null}
              </div>
              {(project.githubLink || project.link) ? (
                <DropdownMenu
                  open={openId === project.id}
                  onOpenChange={(open) => setOpenId(open ? project.id : null)}
                >
                  <DropdownMenuTrigger
                    aria-label={"Project links"}
                    className={"project-link hidden max-[768px]:flex items-center justify-center p-2"}>
                    <EllipsisVertical size={"24"} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={"end"}>
                    {project.githubLink ? (
                      <DropdownMenuItem asChild>
                        <Link href={project.githubLink} target={"_blank"}>
                          <Github size={"18"} />
                          GitHub
                        </Link>
                      </DropdownMenuItem>) : null}
                    {project.link ? (
                      <DropdownMenuItem asChild>
                        <Link href={project.link} target={"_blank"}>
                          <Globe size={"18"} />
                          Website
                        </Link>
                      </DropdownMenuItem>) : null}
                  </DropdownMenuContent>
                </DropdownMenu>) : null}
            </div>
            <p className={"project-description"}>{project.description}</p>
            {project.techStack.length > 0 && (
              <div className="project-techstack flex flex-row flex-wrap gap-1.5">
                {project.techStack.map((technology, technologyIndex) => (
                  <p
                    className={"chip-stroked shadow-xs"}
                    key={`${technology}-${technologyIndex}`}
                  >
                    {technology}
                  </p>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Projects;
