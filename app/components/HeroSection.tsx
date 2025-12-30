"use client"

import React from 'react';
import Image from "next/image";
import {motion} from 'motion/react';
import {containerVariants, itemVariants} from "@/app/motion-variants";
import {FileUser} from "lucide-react";

function HeroSection() {

  return (
    <motion.div className="section hero-section" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div className="hero-section-title-wrapper" variants={itemVariants}>
        <div className="section-title">
          <Image className={"w-[2.5rem] h-[2.5rem]"} src={"/green.webp"} alt={"Green splash"} width={512}
                 height={512}/>
          <h1>Hi there, I'm Petar!</h1>
        </div>
        <Image className={"ghibli-image"} src={"/new-profile.webp"}
               alt={"Petar Marković profile picture"} width={512} height={512}/>
      </motion.div>
      <motion.p className={"hero-paragraph"} variants={itemVariants}>A frontend developer who geeks out over clean code,
        intuitive design, and the
        magic of turning ideas
        into
        real, working things. Web apps? Love ‘em. Websites? Can’t get enough. Give me a problem to solve or
        a
        concept to build, and I’ll happily lose track of time making it happen.
      </motion.p>
      <motion.p className={"hero-paragraph"} variants={itemVariants}>
        By day, I’m crafting full-stack solutions, balancing frontend flair with backend logic (Angular,
        React, Spring Boot, etc.) By night, I’m either deep-diving into some new tech rabbit hole or producing
        electronic music, because creativity shouldn’t stop at the keyboard.
      </motion.p>
      {/*<motion.p className={"hero-paragraph"} variants={itemVariants}>*/}
      {/*  I’m all about that "aha" moment. Whether it’s nailing a tricky feature, designing an interface that*/}
      {/*  just*/}
      {/*  clicks, or stumbling on the perfect synth riff.*/}
      {/*</motion.p>*/}
      <motion.p className={"hero-paragraph"} variants={itemVariants}>
        If you’re looking for someone who cares as much about the Why as the How, let’s chat.
        Coffee’s on me ☕
      </motion.p>
      <motion.a className="contact hero-contact" variants={itemVariants} href={"/Petar_Marković_CV.pdf"}
                target={"_blank"}>
        <FileUser/>
        Resume
      </motion.a>
    </motion.div>
  )
    ;
}

export default HeroSection;