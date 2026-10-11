import type { Metadata } from "next";
import HeroSection from "@/app/components/HeroSection";
import Experience from "@/app/components/Experience";
import PlaygroundSection from "@/app/components/PlaygroundSection";
import WorkSection from "@/app/components/WorkSection";
import UiSounds from "@/app/components/UiSounds";
import PageShell from "@/app/components/PageShell";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Petar Marković | Design Engineer",
  description:
    "Design engineer building polished, accessible interfaces and the systems behind them. Experienced with Angular, React, Next.js, Figma-to-code workflows, and interaction/motion design.",
  path: "/",
});

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
