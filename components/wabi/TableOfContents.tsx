"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ selector = ".prose-wabi" }: { selector?: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // 1. Find all headings
    const container = document.querySelector(selector);
    if (!container) return;

    const elements = Array.from(container.querySelectorAll("h2, h3"));
    const parsedHeadings = elements.map((el) => {
      // Ensure element has an ID
      if (!el.id) {
        el.id = el.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `heading-${Math.random().toString(36).substring(2, 9)}`;
      }
      return {
        id: el.id,
        text: el.textContent || "",
        level: Number(el.tagName.replace("H", ""))
      };
    });

    setHeadings(parsedHeadings);

    // 2. Set up IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" } // Trigger when heading is near the top
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selector]);

  if (headings.length === 0) return null;

  return (
    <nav style={{ marginTop: "2rem" }}>
      <h4 style={{ 
        fontFamily: "var(--mono)", 
        fontSize: "10px", 
        color: "var(--text4)", 
        textTransform: "uppercase", 
        letterSpacing: "0.1em",
        marginBottom: "16px" 
      }}>
        On this page
      </h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
        {headings.map((h) => (
          <li 
            key={h.id}
            style={{
              paddingLeft: h.level === 3 ? "12px" : "0",
            }}
          >
            <a 
              href={`#${h.id}`}
              style={{
                fontFamily: "var(--sans)",
                fontSize: "13px",
                textDecoration: "none",
                display: "block",
                transition: "color 0.2s",
                color: activeId === h.id ? "var(--seal)" : "var(--text3)",
                fontWeight: activeId === h.id ? 500 : 400,
                borderLeft: activeId === h.id ? "2px solid var(--seal)" : "2px solid transparent",
                paddingLeft: "8px",
                marginLeft: "-10px"
              }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                setActiveId(h.id);
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
