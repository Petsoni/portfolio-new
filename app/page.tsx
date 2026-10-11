import HeroSection from "@/app/components/HeroSection";
import Experience from "@/app/components/Experience";
import PlaygroundSection from "@/app/components/PlaygroundSection";
import WorkSection from "@/app/components/WorkSection";
import UiSounds from "@/app/components/UiSounds";
import PageShell from "@/app/components/PageShell";

export default function Home() {
  return (
    <PageShell>
      <UiSounds />
      {/* What he makes comes before where he has worked. */}
      <HeroSection />
      <WorkSection />
      <PlaygroundSection />
      <Experience />
    </PageShell>
  );
}
