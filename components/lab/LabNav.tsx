"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/(site)/(private)/actions";

const NAV_ITEMS = [
  { href: "/lab",           label: "Dashboard",    icon: "⌂", exact: true },
  { href: "/lab/diary",     label: "Daily Diary",  icon: "✎" },
  { href: "/lab/research",  label: "Research",     icon: "◈" },
  { href: "/lab/ideas",     label: "Ideas Wall",   icon: "✦" },
  { href: "/lab/reading",   label: "Reading List", icon: "≡" },
  { href: "/lab/projects",  label: "Projects",     icon: "⬡" },
  { href: "/lab/published", label: "Published",    icon: "↗" },
];

interface LabNavProps {
  userEmail?: string;
}

export function LabNav({ userEmail }: LabNavProps) {
  const pathname = usePathname();

  return (
    <aside className="lab-sidebar">
      {/* Brand */}
      <div className="lab-sidebar-brand">
        <div className="lab-sidebar-logo">研究室</div>
        <div className="lab-sidebar-version">Private Lab · v2</div>
      </div>

      {/* Nav */}
      <nav className="lab-sidebar-nav" aria-label="Lab sections">
        <span className="lab-nav-section-label">Workspace</span>
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && item.href !== "/lab";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`lab-nav-link${isActive ? " active" : ""}`}
            >
              <span className="lab-nav-icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="lab-sidebar-footer">
        {userEmail && (
          <div className="lab-user-email" title={userEmail}>
            {userEmail}
          </div>
        )}
        <form action={signOutAction}>
          <button type="submit" className="lab-exit-btn">
            Exit Lab ↗
          </button>
        </form>
      </div>
    </aside>
  );
}
