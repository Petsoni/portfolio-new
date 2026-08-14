"use client";

import React from "react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "@/app/motion-variants";

const heroLinks = [
  { label: "CV", href: "/Petar_Marković_CV.pdf" },
  { label: "Email", href: "mailto:pmarkovic2308@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/petar-markovic-a38596165/" },
  { label: "GitHub", href: "https://github.com/Petsoni" },
];

function HeroSection() {
  return (
    <motion.section
      className="section hero-section"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="hero-left">
        <motion.h1 variants={itemVariants}>Hi there, I’m Petar.</motion.h1>
        <motion.nav className="hero-links" variants={itemVariants} aria-label="Contact links">
          {heroLinks.map(({ label, href }) => (
            <a key={label} className="hero-link" href={href} target="_blank" rel="noreferrer">
              {label}
            </a>
          ))}
        </motion.nav>
      </div>
      <motion.div className="hero-bio" variants={itemVariants}>
        <p>
          Design engineer based in Serbia, turning ideas into interfaces that feel as good as they look.
        </p>
        <p>
          I work across the full stack, but I care most about the last mile. The motion, the micro-interactions, the details that 	make software feel considered. When I'm not designing or coding, I'm	exploring new technologies or producing electronic music.
        </p>
      </motion.div>
    </motion.section>
  );
}

export default HeroSection;
