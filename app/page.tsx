import HeroSection from "@/app/components/HeroSection";
import Experience from "@/app/components/Experience";
import PlaygroundSection from "@/app/components/PlaygroundSection";
import UiSounds from "@/app/components/UiSounds";
import PageShell from "@/app/components/PageShell";

export default function Home() {
  return (
    <PageShell>
      <UiSounds />
      <HeroSection />
      <Experience />
      <PlaygroundSection />
    </PageShell>
  );
}
