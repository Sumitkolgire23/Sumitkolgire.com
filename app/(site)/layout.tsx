import type { Metadata } from "next";
import { Libre_Baskerville, DM_Mono, Inter } from "next/font/google";
import "@/app/globals.css";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { SiteFooter } from "@/components/layout/SiteFooter";

// ── FONTS ─────────────────────────────────────────────────
// Self-hosted via next/font — zero FOUT, zero CLS

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-libre",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

const inter = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// ── METADATA ──────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXTAUTH_URL ?? "http://localhost:3000"
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
      className={`${libreBaskerville.variable} ${dmMono.variable} ${inter.variable}`}
    >
      <body className="antialiased">
        <SiteNavbar />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
