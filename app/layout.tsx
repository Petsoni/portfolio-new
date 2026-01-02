import type {Metadata} from "next";
import {Geist, Geist_Mono,} from "next/font/google";
import "./global.scss";
import {Analytics} from "@vercel/analytics/next";
import {TooltipProvider} from "@/components/ui/tooltip";

const interTight = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Petar Marković | Frontend Developer",
  description:
    "Frontend Developer specializing in scalable web applications and enterprise systems. Experienced with Angular, React, Next.js, and modern development practices.",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body
      className={`${interTight.variable} ${geistMono.variable} antialiased`}
    >
    <main className={"w-[768px] mx-auto max-[769px]:w-[90%]"}>
      <TooltipProvider>
        {children}
      </TooltipProvider>
      <Analytics/>
    </main>
    </body>
    </html>
  );
}
