import HeroSection from "@/app/components/HeroSection";
import Experience from "@/app/components/Experience";
import PlaygroundSection from "@/app/components/PlaygroundSection";
import UiSounds from "@/app/components/UiSounds";
import HomeReturnFade from "@/app/components/HomeReturnFade";

export default function Home() {
  return (
    <HomeReturnFade>
      <UiSounds />
      <HeroSection />
      <Experience />
      <PlaygroundSection />
    </HomeReturnFade>
  );
}
