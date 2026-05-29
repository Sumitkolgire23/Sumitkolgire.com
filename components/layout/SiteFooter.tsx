import Link from "next/link";
import { MagneticButton } from "@/components/ui/MagneticButton";

const CURRENT_YEAR = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer
      id="site-footer"
      style={{
        borderTop: "1px solid var(--border)",
        padding: "40px",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: "24px",
        background: "var(--bg2)",
      }}
    >
      {/* Left */}
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.05rem", color: "var(--text)" }}>
          Sumit Kolgire
        </span>
        <span style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          AI / ML Engineer · Pune, India · {CURRENT_YEAR}
        </span>
        <nav aria-label="Footer navigation" style={{ marginTop: "12px" }}>
          <ul role="list" style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: "0 18px" }}>
            {[
              { href: "/articles",     label: "Writing" },
              { href: "/perspectives", label: "Perspectives" },
              { href: "/projects",     label: "Projects" },
              { href: "/docs",         label: "Docs" },
              { href: "/resources",    label: "Resources" },
              { href: "/about",        label: "About" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="footer-link underline-draw"
                  style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", textDecoration: "none", letterSpacing: "0.06em", transition: "color 0.2s" }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Centre seal */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="seal-stamp-rotate" aria-hidden="true">
          <circle cx="20" cy="20" r="19" stroke="rgba(196,30,58,.3)" strokeWidth="1"/>
          <circle cx="20" cy="20" r="15" stroke="rgba(196,30,58,.15)" strokeWidth=".5"/>
          <text fontFamily="'Instrument Serif',serif" fontSize="8" fill="rgba(196,30,58,.5)" textAnchor="middle" x="20" y="17" fontStyle="italic">SK</text>
          <text fontFamily="'Geist Mono',monospace" fontSize="4" fill="rgba(196,30,58,.4)" textAnchor="middle" x="20" y="26" letterSpacing="1">{CURRENT_YEAR}</text>
        </svg>
        <span style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", letterSpacing: "0.1em" }}>
          © {CURRENT_YEAR}
        </span>
      </div>

      {/* Right */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
        <nav aria-label="Social links">
          <ul role="list" style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}>
            {[
              { href: "https://github.com/sumitkolgire",        label: "GitHub"   },
              { href: "https://twitter.com/sumitkolgire",       label: "Twitter"  },
              { href: "https://linkedin.com/in/sumitkolgire",   label: "LinkedIn" },
            ].map(({ href, label }) => (
              <li key={href}>
                <MagneticButton strength={0.2}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link underline-draw social-link-glow"
                    style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", textDecoration: "none", letterSpacing: "0.06em", transition: "color 0.2s", display: "inline-block", padding: "2px 6px" }}
                  >
                    {label} ↗
                  </a>
                </MagneticButton>
              </li>
            ))}
          </ul>
        </nav>
        <Link href="/rss" style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--gold)", textDecoration: "none", letterSpacing: "0.05em" }}>
          [RSS]
        </Link>
      </div>

      {/* Full-width colophon */}
      <div
        style={{
          gridColumn: "1 / -1",
          borderTop: "1px solid var(--border)",
          paddingTop: "16px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <p style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text4)", margin: 0 }}>
          © {CURRENT_YEAR} Sumit Kolgire · Built with Next.js, Velite, Drizzle
        </p>
        <p style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text4)", margin: 0, fontStyle: "italic" }}>
          &quot;The obstacle is the way.&quot;
        </p>
      </div>
    </footer>
  );
}
