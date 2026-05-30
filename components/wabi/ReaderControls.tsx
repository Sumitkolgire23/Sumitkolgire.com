"use client";

import { useEffect, useState, useRef } from "react";

export function ReaderControls() {
  const [paperMode, setPaperMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [readingWidth, setReadingWidth] = useState(70); // default in ch
  const [toastMessage, setToastMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Show controls when scrolling past 300px or when mouse moves near the bottom right corner
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hydrate settings on mount
  useEffect(() => {
    const savedPaper = localStorage.getItem("reader-paper-mode") === "true";
    const savedWidth = localStorage.getItem("reader-width");
    
    if (savedPaper) {
      setPaperMode(true);
      document.documentElement.setAttribute("data-paper", "true");
    }
    
    if (savedWidth) {
      const widthVal = parseInt(savedWidth, 10);
      if (!Number.isNaN(widthVal) && widthVal >= 45 && widthVal <= 85) {
        setReadingWidth(widthVal);
        document.documentElement.style.setProperty("--content-width", `${widthVal}ch`);
      }
    }
  }, []);

  // Keyboard controls & Spotlight listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in inputs/textareas
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      if (e.key.toLowerCase() === "p") {
        setPaperMode((prev) => {
          const next = !prev;
          if (next) {
            document.documentElement.setAttribute("data-paper", "true");
            localStorage.setItem("reader-paper-mode", "true");
            triggerToast("Paper Mode Enabled");
          } else {
            document.documentElement.removeAttribute("data-paper");
            localStorage.setItem("reader-paper-mode", "false");
            triggerToast("Paper Mode Disabled");
          }
          return next;
        });
      }

      if (e.key.toLowerCase() === "f") {
        setFocusMode((prev) => {
          const next = !prev;
          if (next) {
            document.documentElement.setAttribute("data-focus", "true");
            triggerToast("Focus Spotlight Enabled");
          } else {
            document.documentElement.removeAttribute("data-focus");
            // Clear spotlight attrs on all elements
            document.querySelectorAll(".prose-wabi p").forEach((p) => {
              p.removeAttribute("data-focus-active");
            });
            triggerToast("Focus Spotlight Disabled");
          }
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Track cursor movement for focus spotlight mode
  useEffect(() => {
    if (!focusMode) return;

    const handleMouseMove = (e: MouseEvent) => {
      const proseContainer = document.querySelector(".prose-wabi");
      if (!proseContainer) return;

      const paragraphs = proseContainer.querySelectorAll("p");
      let closestParagraph: HTMLParagraphElement | null = null;
      let minDistance = Infinity;

      paragraphs.forEach((p) => {
        const rect = p.getBoundingClientRect();
        // Calculate vertical distance from mouse to the middle of the paragraph
        const pMidY = rect.top + rect.height / 2;
        const distance = Math.abs(e.clientY - pMidY);

        // Make sure cursor is reasonably horizontally within bounds or nearby
        if (distance < minDistance) {
          minDistance = distance;
          closestParagraph = p as HTMLParagraphElement;
        }
      });

      paragraphs.forEach((p) => {
        if (p === closestParagraph) {
          p.setAttribute("data-focus-active", "true");
        } else {
          p.removeAttribute("data-focus-active");
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      // Clean up active attributes on exit
      document.querySelectorAll(".prose-wabi p").forEach((p) => {
        p.removeAttribute("data-focus-active");
      });
    };
  }, [focusMode]);

  const triggerToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage("");
    }, 2000);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setReadingWidth(val);
    document.documentElement.style.setProperty("--content-width", `${val}ch`);
    localStorage.setItem("reader-width", String(val));
  };

  return (
    <>
      {/* Toast Notification (Bottom Left) */}
      {toastMessage && (
        <div
          role="status"
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "2rem",
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            padding: "0.5rem 1rem",
            fontSize: "0.75rem",
            fontFamily: "var(--mono)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            zIndex: 1000,
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            animation: "ink-fade-in 0.25s ease-out forwards",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "var(--seal)" }} />
          {toastMessage}
        </div>
      )}

      {/* Floating Width and Toggle Controls (Bottom Right) */}
      <div
        className={`reader-controls-panel ${visible ? "visible" : ""}`}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          zIndex: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "0.75rem",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "all" : "none",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          transform: visible ? "translateY(0)" : "translateY(10px)"
        }}
      >
        {/* Helper keys helper panel (only visible on hover over panel) */}
        <div
          className="reader-shortcuts-hint"
          style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            padding: "0.5rem 0.75rem",
            borderRadius: "2px",
            fontSize: "0.65rem",
            fontFamily: "var(--mono)",
            color: "var(--text3)",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
            pointerEvents: "none",
            transition: "opacity 0.2s ease, transform 0.2s ease",
            transformOrigin: "bottom right"
          }}
        >
          <div><span style={{ color: "var(--seal)" }}>[P]</span> Toggle Paper Mode ({paperMode ? "ON" : "OFF"})</div>
          <div><span style={{ color: "var(--seal)" }}>[F]</span> Toggle Spotlight Mode ({focusMode ? "ON" : "OFF"})</div>
        </div>

        {/* Width Slider Panel */}
        <div
          style={{
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            padding: "0.5rem 0.75rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem"
          }}
        >
          <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", textTransform: "uppercase" }}>
            Width: {readingWidth}ch
          </span>
          <input
            type="range"
            min="45"
            max="85"
            value={readingWidth}
            onChange={handleWidthChange}
            style={{
              width: "100px",
              height: "2px",
              background: "var(--border2)",
              appearance: "none",
              cursor: "ew-resize",
              outline: "none"
            }}
          />
        </div>
      </div>
    </>
  );
}
