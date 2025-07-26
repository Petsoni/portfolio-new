import React from 'react';
import projects from "@/lib/projects.json";
import Link from "next/link";
import Image from "next/image";
import {ArrowUpRight} from "lucide-react";

function Projects() {
    return (
        <div className="section projects-section">
            <div className="section-title">
                <Image className={"w-[2.5rem] h-[2.5rem]"} src={"/purple.webp"} alt={"Purple splash"} width={512}
                       height={512}/>
                <h2>Projects I've worked on</h2>
            </div>
            <div className="flex flex-col gap-10">
                {projects.map((project) => (
                    <div className={"project-wrapper"} key={project.id}>
                        <div className="project-header-wrapper">
                            <Link href={project.link} target={"_blank"}>
                                <h4 className={"project-title"}>
                                    {project.title}
                                    <ArrowUpRight size={"24"}/>
                                </h4>
                            </Link>
                            <div className="separator"></div>
                            <h6>{project.duration}</h6>
                        </div>
                        <p className={"project-description"}>
                            {project.description}
                        </p>
                        <div className="flex flex-row flex-wrap gap-3">
                            {project.roles.map((role, roleIndex) => (
                                <p className={"chip-stroked"} key={`${role}-${roleIndex}`}>{role}</p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Projects;