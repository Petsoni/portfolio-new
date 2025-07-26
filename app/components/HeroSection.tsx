import React from 'react';
import Image from "next/image";

function HeroSection() {
    return (
        <div className="section hero-section">
            <div className="hero-section-title-wrapper">
                <div className="section-title">
                    <Image className={"w-[2.5rem] h-[2.5rem]"} src={"/green.webp"} alt={"Green splash"} width={512}
                           height={512}/>
                    <h1>Hey, I'm Petar Marković!</h1>
                </div>
                <Image className={"ghibli-image"} src={"/ghibli.webp"}
                       alt={"Petar Marković profile picture"} width={512} height={512}/>
            </div>
            <p>A frontend developer who geeks out over clean code, intuitive design, and the magic of turning ideas
                into
                real, working things. Web apps? Love ‘em. Websites? Can’t get enough. Give me a problem to solve or
                a
                concept to build, and I’ll happily lose track of time making it happen 🔥</p>
            <p>
                By day, I’m crafting full-stack solutions, balancing frontend flair with backend logic (Angular,
                React, Spring Boot, etc.) By night, I’m either deep-diving into some new tech rabbit hole or producing
                electronic music—because creativity shouldn’t stop at the keyboard 🎵🎧
            </p>
            <p>
                I’m all about that "aha" moment. Whether it’s nailing a tricky feature, designing an interface that
                just
                clicks, or stumbling on the perfect synth riff ✨
            </p>
            <p>
                If you’re looking for someone who cares as much about the Why as the How, let’s chat.
                Coffee’s on me ☕
            </p>
        </div>
    );
}

export default HeroSection;