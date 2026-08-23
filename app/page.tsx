import HeroSection from "@/app/components/HeroSection";
import Experience from "@/app/components/Experience";
import PlaygroundSection from "@/app/components/PlaygroundSection";
import UiSounds from "@/app/components/UiSounds";

export default function Home() {
  return (
    <div className="page">
      <UiSounds />
      <HeroSection />
      <Experience />
      <PlaygroundSection />
    </div>
  );
}
