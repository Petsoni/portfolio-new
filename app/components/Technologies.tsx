import React from 'react';
import techStack from "@/lib/tech-stack.json";
import Image from "next/image";

function Technologies() {
    return (
        <div className="section">
            <div className="section-title">
                <Image className={"w-[2.5rem] h-[2.5rem]"} src={"/blue.webp"} alt={"Blue splash"} width={512}
                       height={512}/>
                <h2>Technologies I use</h2>
            </div>
            <div className="flex flex-row flex-wrap gap-3">
                {techStack.map((tech) => (
                    <p className={"chip"} key={tech}>{tech}</p>
                ))}
            </div>
        </div>
    );
}

export default Technologies;