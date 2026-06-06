import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./global.scss";
import { Analytics } from "@vercel/analytics/next";
import { TooltipProvider } from "@/components/ui/tooltip";

const openRunde = localFont({
  variable: "--font-open-runde",
  display: "swap",
  src: [
    {
      path: "../public/fonts/OpenRunde-Regular-BF64ee9c6978988.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/OpenRunde-Medium-BF64ee9c695513a.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/OpenRunde-Semibold-BF64ee9c69788f3.woff",
      weight: "600",
      style: "normal",
    },
  ],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Petar Marković | Software Engineer",
  description:
    "Software engineer specializing in scalable web applications and enterprise systems. Experienced with Angular, React, Next.js, and modern development practices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${openRunde.variable} ${geistMono.variable} antialiased`}
      >
        <main className={"w-[768px] mx-auto max-[769px]:w-[90%]"}>
          <TooltipProvider>{children}</TooltipProvider>
          <Analytics />
        </main>
      </body>
    </html>
  );
}
