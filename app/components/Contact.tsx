import React from 'react';
import Image from "next/image";
import {Github, Linkedin, Mail, Twitter} from "lucide-react";
import Link from "next/link";

function Contact() {
    return (
        <div className={"section"}>
            <div className="section-title">
                <Image className={"w-[2.5rem] h-[2.5rem]"} src={"/orange.webp"} alt={"Orange splash"} width={512}
                       height={512}/>
                <h2>Let's get in touch</h2>
            </div>
            <div className="contacts-wrapper">
                <Link className="contact" href={"https://x.com/petsoni_"} target={"_blank"}>
                    <Twitter/>
                    petsoni_
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
            </div>
        </div>
    );
}

export default Contact;