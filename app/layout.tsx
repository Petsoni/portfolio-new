import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./global.scss";
import { Analytics } from "@vercel/analytics/next";
import MotionProvider from "@/app/components/MotionProvider";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { themeInitScript } from "@/app/theme-preference";
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

// Browser chrome on mobile matches the page in each scheme. These follow the
// system setting only; a meta tag can't see the theme toggle. Values are
// --surface-page from _theme.scss — a meta tag can't read CSS variables.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The head script may set data-theme on <html> before React hydrates;
    // suppressHydrationWarning keeps that expected difference quiet.
    <html lang="en" className={sans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased">
        <MotionProvider>
          {/* One column: settings, the page, the footer. The footer sits
              outside <main> so it is the page's contentinfo landmark. */}
          <div className={"relative w-[834px] mx-auto max-[920px]:w-[90%]"}>
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </div>
          <Analytics />
        </MotionProvider>
      </body>
    </html>
  );
}
