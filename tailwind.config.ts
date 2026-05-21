import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      // ── WABI-SABI CORE PALETTE ─────────────────────────────────
      colors: {
        ink: {
          DEFAULT: "#1c1a15",
          2: "#2c2925",
          light: "#3d3830",
        },
        muted: "#6b6558",
        ghost: "#9b9284",
        paper: {
          DEFAULT: "#f7f3ec",
          2: "#f0ebe0",
          3: "#e8e0d0",
          washi: "#ede8dc",
        },
        seal: {
          DEFAULT: "#c41e3a",
          light: "rgba(196,30,58,0.12)",
        },
        gold: {
          DEFAULT: "#8b7355",
          warm: "#c8a96e",
        },
        moss: {
          DEFAULT: "#2d6a4f",
          light: "#52b788",
        },
        // Neural Parchment: subtle tech accent for AI/research tags only
        teal: {
          DEFAULT: "#0d9488",
          light: "rgba(13,148,136,0.12)",
        },
        sky: {
          DEFAULT: "#1d4ed8",
          light: "rgba(29,78,216,0.08)",
        },
        warn: "#b45309",
        danger: "#b91c1c",
        ok: "#15803d",
        purple: "#6d28d9",
      },

      // ── TYPOGRAPHY ─────────────────────────────────────────────
      fontFamily: {
        serif: ["var(--font-libre)", "Georgia", "serif"],
        display: ["var(--font-shippori)", "Georgia", "serif"],
        mono: ["var(--font-dm-mono)", "Courier New", "monospace"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },

      // ── SPACING ────────────────────────────────────────────────
      maxWidth: {
        prose: "70ch",
        reading: "75ch",
        site: "1100px",
        wide: "1300px",
      },

      // ── ANIMATIONS ─────────────────────────────────────────────
      keyframes: {
        "ink-fade": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "ink-reveal": {
          "0%": { opacity: "0", clipPath: "inset(0 100% 0 0)" },
          "100%": { opacity: "1", clipPath: "inset(0 0% 0 0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "ink-fade": "ink-fade 0.5s ease-out forwards",
        "ink-reveal": "ink-reveal 0.7s ease-out forwards",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },

      // ── BORDERS ────────────────────────────────────────────────
      borderColor: {
        wabi: "rgba(139,115,85,0.15)",
        "wabi-strong": "rgba(139,115,85,0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
