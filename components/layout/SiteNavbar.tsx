"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { SealStamp } from "@/components/wabi/SealStamp";

const NAV_LINKS = [
  { href: "/articles",     label: "Writing"     },
  { href: "/perspectives", label: "Perspectives" },
  { href: "/projects",     label: "Projects"    },
  { href: "/docs",         label: "Docs"        },
  { href: "/resources",    label: "Resources"   },
  { href: "/about",        label: "About"       },
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

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <>
      <header
        id="site-navbar"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: scrolled ? "rgba(247,243,236,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid var(--ink-faint)" : "1px solid transparent",
          transition: "background 0.3s, backdrop-filter 0.3s, border-color 0.3s",
        }}
      >
        <nav
          style={{
            maxWidth: "var(--site-width)",
            margin: "0 auto",
            padding: "0 1.5rem",
            height: "3.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="Sumit Kolgire — Home"
            style={{
              fontFamily: "var(--serif)",
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "var(--ink)",
              textDecoration: "none",
              letterSpacing: "-0.01em",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <SealStamp size="sm" />
            Sumit Kolgire
          </Link>

          {/* Desktop nav links */}
          <ul
            role="list"
            style={{
              display: "flex",
              gap: "0.25rem",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
            className="hidden-mobile"
          >
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "0.78rem",
                      letterSpacing: "0.04em",
                      color: active ? "var(--seal)" : "var(--ink-mid)",
                      textDecoration: "none",
                      padding: "0.4rem 0.7rem",
                      borderBottom: active ? "1px solid var(--seal)" : "1px solid transparent",
                      transition: "color 0.15s, border-color 0.15s",
                    }}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-toggle"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen ? true : false}
            onClick={() => setMobileOpen((v) => !v)}
            className="show-mobile"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <span
              style={{
                display: "block",
                width: "22px",
                height: "1px",
                background: "var(--ink)",
                transition: "transform 0.2s",
                transform: mobileOpen ? "translateY(6px) rotate(45deg)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: "22px",
                height: "1px",
                background: "var(--ink)",
                opacity: mobileOpen ? 0 : 1,
                transition: "opacity 0.2s",
              }}
            />
            <span
              style={{
                display: "block",
                width: "22px",
                height: "1px",
                background: "var(--ink)",
                transition: "transform 0.2s",
                transform: mobileOpen ? "translateY(-6px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile navigation"
          style={{
            position: "fixed",
            top: "3.75rem",
            left: 0,
            right: 0,
            background: "var(--paper)",
            borderBottom: "1px solid var(--ink-faint)",
            zIndex: 49,
            padding: "1rem 1.5rem 1.5rem",
          }}
          className="show-mobile"
        >
          <ul role="list" style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "0.9rem",
                    color: pathname.startsWith(href) ? "var(--seal)" : "var(--ink)",
                    textDecoration: "none",
                    letterSpacing: "0.04em",
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
