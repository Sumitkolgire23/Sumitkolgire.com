import type { Metadata } from "next";
import { Instrument_Serif, Geist_Mono, Geist } from "next/font/google";
import "@/app/globals.css";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { DarkPageEffects } from "@/components/layout/DarkPageEffects";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { AuroraBackground } from "@/components/effects/AuroraBackground";

// ── FONTS ─────────────────────────────────────────────────
// Self-hosted via next/font — zero FOUT, zero CLS

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-libre", // reuse existing var so prose-wabi still works
  display: "swap",
});

const geistMono = Geist_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono", // reuse existing var
  display: "swap",
});

const geist = Geist({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-inter", // reuse existing var
  display: "swap",
});

// ── METADATA ──────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://sumitkolgire.com"
  ),
  title: {
    default: "Sumit Kolgire — AI/ML Engineer",
    template: "%s | Sumit Kolgire",
  },
  description:
    "AI/ML engineer in the making. Building intelligent systems, documenting the journey. Articles, research, projects, and ideas — a living lab.",
  keywords: [
    "AI engineer",
    "machine learning",
    "multi-agent systems",
    "Next.js",
    "research",
    "Sumit Kolgire",
  ],
  authors: [{ name: "Sumit Kolgire" }],
  creator: "Sumit Kolgire",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Sumit Kolgire",
    title: "Sumit Kolgire — AI/ML Engineer",
    description:
      "AI/ML engineer in the making. Building intelligent systems, documenting the journey.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@sumitkolgire",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ── ROOT LAYOUT ────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${geistMono.variable} ${geist.variable}`}
    >
      <body className="antialiased" style={{ position: "relative" }}>
        {/* Skip link — WCAG 2.4.1: bypass navigation for keyboard/screen reader users */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AuroraBackground />
        <SmoothScrollProvider>
          <DarkPageEffects />
          <SiteNavbar />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
