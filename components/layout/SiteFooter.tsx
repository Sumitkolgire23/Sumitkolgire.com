import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/articles",     label: "Writing"      },
  { href: "/perspectives", label: "Perspectives" },
  { href: "/projects",     label: "Projects"     },
  { href: "/docs",         label: "Docs"         },
  { href: "/resources",    label: "Resources"    },
  { href: "/newsletter",   label: "Newsletter"   },
  { href: "/about",        label: "About"        },
];

const SOCIAL_LINKS = [
  { href: "https://github.com/sumitkolgire",   label: "GitHub"   },
  { href: "https://twitter.com/sumitkolgire",  label: "Twitter"  },
  { href: "https://linkedin.com/in/sumitkolgire", label: "LinkedIn" },
];

const CURRENT_YEAR = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer
      id="site-footer"
      style={{
        background: "var(--ink)",
        color: "var(--paper)",
        padding: "3rem 1.5rem 2rem",
        marginTop: "6rem",
      }}
    >
      <div
        style={{
          maxWidth: "var(--site-width)",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        {/* Left: identity + tagline */}
        <div>
          <p
            style={{
              fontFamily: "var(--serif)",
              fontSize: "1.1rem",
              fontWeight: 700,
              marginBottom: "0.35rem",
            }}
          >
            Sumit Kolgire
          </p>
          <p
            style={{
              fontFamily: "var(--mono)",
              fontSize: "0.75rem",
              color: "rgba(247,243,236,0.5)",
              letterSpacing: "0.05em",
              marginBottom: "1.5rem",
            }}
          >
            AI/ML engineer in the making
          </p>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <ul
              role="list"
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexWrap: "wrap",
                gap: "0.25rem 1.25rem",
              }}
            >
              {FOOTER_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "0.75rem",
                      color: "rgba(247,243,236,0.6)",
                      textDecoration: "none",
                      letterSpacing: "0.03em",
                      transition: "color 0.15s",
                    }}
                    className="footer-link"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Right: social + colophon */}
        <div style={{ textAlign: "right" }}>
          <nav aria-label="Social links">
            <ul
              role="list"
              style={{
                listStyle: "none",
                margin: "0 0 1.5rem",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
                alignItems: "flex-end",
              }}
            >
              {SOCIAL_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "0.75rem",
                      color: "rgba(247,243,236,0.55)",
                      textDecoration: "none",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* RSS */}
          <Link
            href="/rss"
            style={{
              fontFamily: "var(--mono)",
              fontSize: "0.7rem",
              color: "var(--gold)",
              textDecoration: "none",
              letterSpacing: "0.05em",
            }}
          >
            [RSS]
          </Link>
        </div>
      </div>

      {/* Colophon */}
      <div
        style={{
          maxWidth: "var(--site-width)",
          margin: "2rem auto 0",
          paddingTop: "1.25rem",
          borderTop: "1px solid rgba(247,243,236,0.1)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--mono)",
            fontSize: "0.68rem",
            color: "rgba(247,243,236,0.35)",
            margin: 0,
          }}
        >
          © {CURRENT_YEAR} Sumit Kolgire · Built with Next.js, Velite, Drizzle
        </p>
        <p
          style={{
            fontFamily: "var(--mono)",
            fontSize: "0.68rem",
            color: "rgba(247,243,236,0.25)",
            margin: 0,
            fontStyle: "italic",
          }}
        >
          &quot;The obstacle is the way.&quot;
        </p>
      </div>
    </footer>
  );
}
