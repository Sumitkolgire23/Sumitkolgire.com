"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/(auth)/actions";

const TABS = [
  { href: "/lab/diary",     label: "Daily Diary",  dot: "var(--seal)"  },
  { href: "/lab/ideas",     label: "Ideas Wall",   dot: "var(--gold)"  },
  { href: "/lab/research",  label: "Research",     dot: "var(--sky)"   },
  { href: "/lab/reading",   label: "Reading List", dot: "var(--text3)" },
  { href: "/lab/published", label: "Published",    dot: "var(--moss)"  },
];

import { Menu, Settings } from "lucide-react";
import { useLabShell } from "@/components/lab/LabShellClient";

interface LabTopBarProps { userInitial?: string; streak?: number; }

export function LabTopBar({ userInitial = "SK", streak = 0 }: LabTopBarProps) {
  const pathname = usePathname();
  const { navOpen, setNavOpen, panelOpen, setPanelOpen, hasPanel } = useLabShell();

  return (
    <header className="lab-topbar">
      {/* Mobile Menu Toggle */}
      <button
        className="lab-menu-toggle"
        onClick={() => setNavOpen(!navOpen)}
        aria-label="Toggle menu"
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text3)",
          cursor: "pointer",
          marginRight: "10px",
          display: "none", // overridden in lab.css media query
          alignItems: "center",
          padding: 0,
        }}
      >
        <Menu size={20} />
      </button>

      {/* Logo */}
      <div className="topbar-logo">
        <svg className="logo-seal" viewBox="0 0 26 26" fill="none" aria-hidden="true">
          <circle cx="13" cy="13" r="12" stroke="var(--seal)" strokeWidth="1"/>
          <text x="13" y="17" textAnchor="middle" fontFamily="serif" fontSize="10" fill="var(--seal)">研</text>
        </svg>
        <div className="logo-text">
          <span className="logo-name">The Lab</span>
          <span className="logo-sub">v1.0 · private</span>
        </div>
      </div>

      {/* Section tabs */}
      <nav className="topbar-nav" aria-label="Lab sections">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`tnav-item${pathname.startsWith(t.href) ? " active" : ""}`}
          >
            <span className="tnav-dot" style={{ background: t.dot }} />
            {t.label}
          </Link>
        ))}
      </nav>

      {/* Right: streak + save status + logout */}
      <div className="topbar-right">
        <div className="streak-chip">{streak} day streak</div>
        <div className="save-status">
          <span className="save-dot" />
          <span>Saved</span>
        </div>

        {/* Avatar + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {hasPanel && (
            <button
              className="lab-settings-toggle"
              onClick={() => setPanelOpen(!panelOpen)}
              aria-label="Toggle editor settings"
              style={{
                background: "transparent",
                border: "none",
                color: panelOpen ? "var(--seal)" : "var(--text3)",
                cursor: "pointer",
                marginRight: "4px",
                display: "none", // overridden in lab.css media query
                alignItems: "center",
                padding: 0,
              }}
            >
              <Settings size={18} />
            </button>
          )}
          <div className="lab-avatar" aria-label="Logged in user">{userInitial}</div>
          <form action={signOutAction}>
            <button
              type="submit"
              title="Sign out"
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--text3)",
                fontFamily: "var(--mono)",
                fontSize: "10px",
                letterSpacing: ".08em",
                padding: "4px 10px",
                cursor: "pointer",
                transition: "all .2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--seal)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--seal)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text3)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
              }}
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
