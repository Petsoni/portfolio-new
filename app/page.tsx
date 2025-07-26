import "./common.scss";
import HeroSection from "@/app/components/HeroSection";
import Technologies from "@/app/components/Technologies";
import Projects from "@/app/components/Projects";
import Contact from "@/app/components/Contact";

export default function Home() {
    return (
        <div className="pt-12">
            <HeroSection/>
            <Technologies/>
            <Projects/>
            <Contact/>
        </div>
    );
}
