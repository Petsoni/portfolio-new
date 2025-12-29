"use client";

import React from 'react';
import Image from "next/image";
import {FileUser, Github, Linkedin, Mail, Twitter} from "lucide-react";
import Link from "next/link";
import { motion } from 'motion/react';
import {containerVariants, itemVariants} from "@/app/motion-variants";

function Contact() {
    return (
        <motion.div className={"section contact-section"} variants={containerVariants} initial="hidden" animate="visible">
            <motion.div className="section-title" variants={itemVariants}>
                <Image className={"w-[2.5rem] h-[2.5rem]"} src={"/orange.webp"} alt={"Orange splash"} width={512}
                       height={512}/>
                <h2>Let's get in touch</h2>
            </motion.div>
            <motion.div className="contacts-wrapper" variants={itemVariants}>
                <Link className="contact" href={"/Petar_Marković_CV.pdf"} target={"_blank"}>
                    <FileUser/>
                    Resume
                </Link>
                <Link className="contact" href={"https://x.com/petsonii"} target={"_blank"}>
                    <Twitter/>
                    petsonii
                </Link>
                <Link className="contact" href={"https://www.linkedin.com/in/petar-markovic-a38596165/"} target={"_blank"}>
                    <Linkedin/>
                    Petar Marković
                </Link>
                <Link className="contact" href={"mailto:pmarkovic2308@gmail.com"} target={"_blank"}>
                    <Mail/>
                    pmarkovic2308@gmail.com
                </Link>
                <Link className="contact" href={"https://github.com/Petsoni"} target={"_blank"}>
                    <Github/>
                    Petsoni
                </Link>
            </motion.div>
        </motion.div>
    );
}

export default Contact;