import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  // ── IMAGES ──────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // ── TURBOPACK ───────────────────────────────────────────
  // Next.js 16 uses Turbopack by default. Velite runs as a
  // pre-build step via the `prebuild` / `predev` npm scripts.
  turbopack: {},

  // ── SECURITY HEADERS ────────────────────────────────────
  async headers() {
    const strictCSP = [
      "default-src 'self'",
      // No unsafe-eval on public/lab pages — protects against XSS
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://res.cloudinary.com",
      "media-src 'self' https://res.cloudinary.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-src 'self'",
      "worker-src 'self'",
    ].join("; ");

    // Sanity Studio requires unsafe-eval — scope it ONLY to /studio
    const studioCSP = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://cdn.sanity.io https://res.cloudinary.com",
      "media-src 'self' https://res.cloudinary.com",
      "connect-src 'self' https://*.sanity.io https://*.supabase.co wss://*.supabase.co",
      "frame-src 'self'",
      "worker-src 'self'",
    ].join("; ");

    const commonHeaders = [
      { key: "X-DNS-Prefetch-Control",  value: "on" },
      { key: "X-Frame-Options",         value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options",  value: "nosniff" },
      { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy",      value: "camera=(), microphone=(), geolocation=()" },
    ];

    return [
      // Sanity Studio — relaxed CSP
      {
        source: "/studio/(.*)",
        headers: [
          ...commonHeaders,
          { key: "Content-Security-Policy", value: studioCSP },
        ],
      },
      // Everything else — strict CSP
      {
        source: "/((?!studio).*)",
        headers: [
          ...commonHeaders,
          { key: "Content-Security-Policy", value: strictCSP },
        ],
      },
    ];
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
