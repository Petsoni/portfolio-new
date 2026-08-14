import HeroSection from "@/app/components/HeroSection";
import Experience from "@/app/components/Experience";
import ThemeToggle from "@/app/components/ThemeToggle";
import UiSounds from "@/app/components/UiSounds";

export default function Home() {
  return (
    <div className="page">
      <UiSounds />
      <ThemeToggle />
      <HeroSection />
      <Experience />
    </div>
  );
}
