import type { Metadata } from "next";
import "./global.scss";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Petar Marković | Design Engineer",
  description:
    "Design engineer building polished, accessible interfaces and the systems behind them. Experienced with Angular, React, Next.js, Figma-to-code workflows, and interaction/motion design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <main className={"w-[834px] mx-auto max-[920px]:w-[90%]"}>
          {children}
          <Analytics />
        </main>
      </body>
    </html>
  );
}
