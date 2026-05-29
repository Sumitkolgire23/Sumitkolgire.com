"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const NAV_LINKS = [
  { href: "/articles",     label: "Writing"      },
  { href: "/perspectives", label: "Perspectives" },
  { href: "/projects",     label: "Projects"     },
  { href: "/docs",         label: "Docs"         },
  { href: "/resources",    label: "Resources"    },
  { href: "/about",        label: "About"        },
];

export function SiteNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <>
      <header
        id="site-navbar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 500,
          height: scrolled ? "48px" : "54px",
          display: "flex",
          alignItems: "center",
          padding: "0 40px",
          justifyContent: "space-between",
          background: "rgba(13, 13, 14, 0.88)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid #242428",
          transition: "height 0.3s",
        }}
      >
        {/* Logo */}
        <MagneticButton strength={0.15}>
          <Link
            href="/"
            aria-label="Sumit Kolgire — Home"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
            }}
          >
            {/* SVG seal */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="seal-stamp-rotate" style={{ flexShrink: 0 }}
            >
              <circle cx="16" cy="16" r="15" stroke="#c41e3a" strokeWidth="1"/>
              <circle cx="16" cy="16" r="11.5" stroke="#c41e3a" strokeWidth="0.5"/>
              <text fontFamily="'Instrument Serif',serif" fontSize="7" fill="#c41e3a" textAnchor="middle" x="16" y="13" fontStyle="italic">SK</text>
              <text fontFamily="'Geist Mono',monospace" fontSize="4" fill="#c41e3a" textAnchor="middle" x="16" y="21" letterSpacing="1">LAB</text>
            </svg>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--text2)", letterSpacing: "0.05em" }}>
                sumit kolgire
              </span>
              <span style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                AI / ML Engineer
              </span>
            </div>
          </Link>
        </MagneticButton>

        {/* Desktop nav links */}
        <ul
          role="list"
          className="hidden-mobile"
          style={{ display: "flex", alignItems: "center", gap: "4px", listStyle: "none", margin: 0, padding: 0 }}
        >
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname.startsWith(href);
            return (
              <li key={href}>
                <MagneticButton strength={0.25}>
                  <Link
                    href={href}
                    className="underline-draw"
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "11px",
                      color: active ? "var(--text)" : "var(--text2)",
                      textDecoration: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      letterSpacing: "0.06em",
                      transition: "all 0.2s",
                      background: active ? "var(--bg3)" : "transparent",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = "var(--text)";
                      (e.currentTarget as HTMLElement).style.background = "var(--bg3)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = active ? "var(--text)" : "var(--text2)";
                      (e.currentTarget as HTMLElement).style.background = active ? "var(--bg3)" : "transparent";
                    }}
                  >
                    {label}
                  </Link>
                </MagneticButton>
              </li>
            );
          })}
        </ul>

        {/* Mobile hamburger only */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", zIndex: 10100 }}>
          <button
            id="mobile-menu-toggle"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(v => !v)}
            className="show-mobile"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "0.5rem", display: "flex", flexDirection: "column", gap: "5px", zIndex: 10100 }}
          >
            <span style={{ display: "block", width: "22px", height: "1px", background: "var(--text)", transition: "transform 0.2s", transform: mobileOpen ? "translateY(6px) rotate(45deg)" : "none" }} />
            <span style={{ display: "block", width: "22px", height: "1px", background: "var(--text)", opacity: mobileOpen ? 0 : 1, transition: "opacity 0.2s" }} />
            <span style={{ display: "block", width: "22px", height: "1px", background: "var(--text)", transition: "transform 0.2s", transform: mobileOpen ? "translateY(-6px) rotate(-45deg)" : "none" }} />
          </button>
        </div>
      </header>

      {/* Spacer so content doesn't hide under fixed nav */}
      <div style={{ height: scrolled ? "48px" : "54px", transition: "height 0.3s" }} aria-hidden="true" />

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile navigation"
        className={`show-mobile mobile-drawer ${mobileOpen ? "open" : ""}`}
      >
        {NAV_LINKS.map(({ href, label }) => (
          <Link key={href} href={href} className="underline-draw">
            {label}
          </Link>
        ))}
      </div>
    </>
  );
}
