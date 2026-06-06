"use client"

import React from 'react';
import Image from "next/image";
import {motion} from 'motion/react';
import {containerVariants, itemVariants} from "@/app/motion-variants";
import {hapticOnEnter} from "@/app/haptics";
import {FileUser} from "lucide-react";

function HeroSection() {

	return (
		<motion.div className="section hero-section" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
			<motion.div className="hero-section-title-wrapper" variants={itemVariants} onAnimationStart={hapticOnEnter}>
				<div className="section-title">
					<Image className={"w-[2.5rem] h-[2.5rem]"} src={"/green.webp"} alt={"Green splash"} width={512}
					       height={512}/>
					<h1>Hi there, I'm Petar!</h1>
				</div>
				<Image className={"ghibli-image"} src={"/new-profile.webp"}
				       alt={"Petar Marković profile picture"} width={512} height={512}/>
			</motion.div>
			<motion.div className={"hero-bio"} variants={itemVariants} onAnimationStart={hapticOnEnter}>
				<div className={"hero-bio-inner"}>
					<p className={"hero-paragraph"}>Software developer based in Serbia, building
						full-stack web applications.
					</p>
					<p className={"hero-paragraph"}>I create interfaces and full-stack
						solutions, working across the entire development cycle, from concept to deployment. When I'm not coding, I'm
						exploring new technologies or producing electronic music.
					</p>
					<p className={"hero-paragraph"}>Open to collaborations and interesting projects.
						If you’re looking for someone who cares as much about the Why as the How, let’s chat.
						Coffee’s on me ☕
					</p>
				</div>
			</motion.div>
			<motion.a className="contact hero-contact" variants={itemVariants} onAnimationStart={hapticOnEnter} href={"/Petar_Marković_CV.pdf"}
			          target={"_blank"}>
				<FileUser/>
				Download CV
			</motion.a>
		</motion.div>
	)
		;
}

export default HeroSection;