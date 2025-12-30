import "./common.scss";
import HeroSection from "@/app/components/HeroSection";
import Technologies from "@/app/components/Technologies";
import Experience from "@/app/components/Experience";
import Contact from "@/app/components/Contact";
import Projects from "@/app/components/Projects";
import ThemeToggle from "@/app/components/ThemeToggle";

export default function Home() {
  return (
    <div className="pt-12">
      <ThemeToggle/>
      <HeroSection/>
      <Technologies/>
      <Experience/>
      <Projects/>
      <Contact/>
    </div>
  );
}
