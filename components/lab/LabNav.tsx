"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/(site)/(private)/actions";



const SECTIONS = [
  { href: "/lab/diary",     label: "Daily Diary",  badge: "12",  badgeSeal: false,
    icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 2h8a1 1 0 011 1v10a1 1 0 01-1 1H3V2z"/><path d="M6 6h4M6 9h4M6 12h2"/></svg> },
  { href: "/lab/ideas",     label: "Ideas Wall",   badge: "34",  badgeSeal: false,
    icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="6" r="3"/><path d="M6 9.5c0 1 .9 2 2 2s2-1 2-2"/><path d="M7 11.5V13h2v-1.5"/></svg> },
  { href: "/lab/research",  label: "Research",     badge: "8",   badgeSeal: false,
    icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6.5" cy="6.5" r="3.5"/><path d="M9.5 9.5L13 13"/></svg> },
  { href: "/lab/reading",   label: "Reading List", badge: "21",  badgeSeal: false,
    icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h5v10L8 12l1 1V3h5v10l-6 1-6-1V3z"/></svg> },
  { href: "/lab/published", label: "Published",    badge: "3",   badgeSeal: true,
    icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8l5-5 5 5M8 3v10"/></svg> },
];

const PROJECTS = [
  { label: "NOVELMAN",         dot: "var(--seal)" },
  { label: "Multi-Agent Lab",  dot: "var(--gold)" },
  { label: "GrowthMate",       dot: "var(--sky)"  },
];

interface LabNavProps { userEmail?: string; streak?: number; heatmapLevels?: number[]; }

const DEFAULT_HEATMAP = Array<number>(20).fill(0);

export function LabNav({ userEmail, streak = 0, heatmapLevels = DEFAULT_HEATMAP }: LabNavProps) {
  const pathname = usePathname();

  return (
    <nav className="lab-leftnav" aria-label="Lab navigation">
      {/* Streak card */}
      <div className="nav-streak-card">
        <div className="nsc-label">Writing streak</div>
        <div className="nsc-num">{streak}</div>
        <div className="nsc-sub">days in a row</div>
        {/* Mini heatmap — live data, oldest → newest */}
        <div className="heatmap-mini" aria-hidden="true" title="Activity last 20 days">
          {heatmapLevels.map((lvl, i) => (
            <div key={i} className={`hm hm${lvl}`} />
          ))}
        </div>
      </div>

      <div className="nav-divider" />

      {/* Sections */}
      <div className="nav-section-label">Sections</div>
      {SECTIONS.map((s) => {
        const active = pathname.startsWith(s.href);
        return (
          <Link key={s.href} href={s.href} className={`nav-item${active ? " active" : ""}`}>
            <span className="nav-icon">{s.icon}</span>
            {s.label}
            <span className={`nav-badge${s.badgeSeal ? " seal" : ""}`}>{s.badge}</span>
          </Link>
        );
      })}

      <div className="nav-divider" />

      {/* Projects */}
      <div className="nav-section-label">Projects</div>
      {PROJECTS.map((p) => (
        <button key={p.label} className="nav-item" type="button">
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.dot, flexShrink: 0 }} />
          {p.label}
        </button>
      ))}

      <div className="nav-divider" />

      {/* Footer */}
      <form action={signOutAction}>
        <button type="submit" className="nav-item" style={{ color: "var(--text3)" }}>
          <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 3H3v10h3M10 5l3 3-3 3M13 8H7"/>
          </svg>
          Back to site ↗
        </button>
      </form>
    </nav>
  );
}
