import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./global.scss";
import { Analytics } from "@vercel/analytics/next";
import MotionProvider from "@/app/components/MotionProvider";
import SoundToggle from "@/app/components/SoundToggle";
import { siteUrl } from "@/lib/metadata";

// The site's one typeface. next/font downloads it at build time and serves it
// from this origin with a metrics-matched fallback, so there is no request to
// Google at runtime and no layout shift when it swaps in. Before this the
// site used the system stack, so it was set in a different face on every OS.
// TODO(petar): pick the face. Geist is the safe default; to change it, swap
// this import — everything else reads the --font-sans-face variable — and
// re-check the tracking tokens in global.scss, which are tuned for Geist.
const sans = Geist({
  // latin-ext carries the ć in Marković.
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans-face",
  display: "swap",
});

// Site-wide defaults. Each page adds its own title, description, canonical
// URL and social tags through pageMetadata (lib/metadata.ts).
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Petar Marković | Design Engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="antialiased">
        <MotionProvider>
          <main className={"relative w-[834px] mx-auto max-[920px]:w-[90%]"}>
            <SoundToggle />
            {children}
            <Analytics />
          </main>
        </MotionProvider>
      </body>
    </html>
  );
}
