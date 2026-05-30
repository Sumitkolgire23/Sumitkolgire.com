"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getFeatureFlags } from "@/lib/features";
import { createClient } from "@/utils/supabase/client";

interface HomeStatsBarProps {
  streak: number;
  projectCount: number;
  totalWords: number;
}

export function HomeStatsBar({
  streak,
  projectCount,
  totalWords,
}: HomeStatsBarProps) {
  // Live states for Realtime updates
  const [liveProjects, setLiveProjects] = useState(projectCount);
  const [liveStreak, setLiveStreak] = useState(streak);
  const [liveWords, setLiveWords] = useState(totalWords);

  // References for count-up DOM nodes
  const projectsRef = useRef<HTMLDivElement>(null);
  const streakRef = useRef<HTMLSpanElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);

  // References to preserve values across animation ticks
  const prevProjects = useRef(0);
  const prevStreak = useRef(0);
  const prevWords = useRef(0);

  // 1. D3-style GSAP Counter Animations
  useEffect(() => {
    // Register ScrollTrigger safely
    gsap.registerPlugin(ScrollTrigger);

    const checkAnimations = getFeatureFlags().scrollAnimations;
    const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!checkAnimations || reducedMotion) {
      if (projectsRef.current) projectsRef.current.textContent = String(liveProjects);
      if (streakRef.current) streakRef.current.textContent = String(liveStreak);
      if (wordsRef.current) wordsRef.current.textContent = liveWords.toLocaleString();
      
      prevProjects.current = liveProjects;
      prevStreak.current = liveStreak;
      prevWords.current = liveWords;
      return;
    }

    // Projects count-up
    const projectsObj = { val: prevProjects.current };
    const projectsAnim = gsap.to(projectsObj, {
      val: liveProjects,
      duration: 1.2,
      ease: "power2.out",
      onUpdate: () => {
        if (projectsRef.current) {
          projectsRef.current.textContent = String(Math.floor(projectsObj.val));
        }
      },
      scrollTrigger: {
        trigger: projectsRef.current,
        start: "top 95%",
        toggleActions: "play none none none",
      },
    });

    // Streak count-up
    let streakAnim: any;
    if (streakRef.current) {
      const streakObj = { val: prevStreak.current };
      streakAnim = gsap.to(streakObj, {
        val: liveStreak,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () => {
          if (streakRef.current) {
            streakRef.current.textContent = String(Math.floor(streakObj.val));
          }
        },
        scrollTrigger: {
          trigger: streakRef.current,
          start: "top 95%",
          toggleActions: "play none none none",
        },
      });
    }

    // Words count-up
    let wordsAnim: any;
    if (wordsRef.current) {
      const wordsObj = { val: prevWords.current };
      wordsAnim = gsap.to(wordsObj, {
        val: liveWords,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: () => {
          if (wordsRef.current) {
            wordsRef.current.textContent = Math.floor(wordsObj.val).toLocaleString();
          }
        },
        scrollTrigger: {
          trigger: wordsRef.current,
          start: "top 95%",
          toggleActions: "play none none none",
        },
      });
    }

    // Update refs to current targets for subsequent mutations
    prevProjects.current = liveProjects;
    prevStreak.current = liveStreak;
    prevWords.current = liveWords;

    return () => {
      projectsAnim.kill();
      if (projectsAnim.scrollTrigger) projectsAnim.scrollTrigger.kill();
      if (streakAnim) {
        streakAnim.kill();
        if (streakAnim.scrollTrigger) streakAnim.scrollTrigger.kill();
      }
      if (wordsAnim) {
        wordsAnim.kill();
        if (wordsAnim.scrollTrigger) wordsAnim.scrollTrigger.kill();
      }
    };
  }, [liveProjects, liveStreak, liveWords]);

  // 2. Realtime listener to refresh stats upon mutations
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    const refreshStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setLiveProjects(data.projectCount);
          setLiveStreak(data.streak);
          setLiveWords(data.wordCount);
        }
      } catch (err) {
        console.error("[HomeStatsBar] Failed to reload stats:", err);
      }
    };

    const channel = supabase
      .channel("stats-realtime-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "diary_entries" },
        refreshStats
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ideas" },
        refreshStats
      );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      <div
        id="stats-bar-wrapper"
        style={{
          display: "flex",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          margin: "0 40px",
          position: "relative",
          overflow: "hidden",
        }}
        className="reveal animate-fade-in"
      >
        <div className="dot-grid-bg" />

        {/* 1. Active Projects Count */}
        <div
          style={{ flex: 1, padding: "24px 28px", borderRight: "1px solid var(--border)", transition: "background .25s", cursor: "default" }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.02)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "")}
        >
          <div
            ref={projectsRef}
            style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", fontStyle: "italic", color: "var(--text)", lineHeight: 1, marginBottom: "5px" }}
          >
            {liveProjects}
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", letterSpacing: ".12em", textTransform: "uppercase" }}>
            Active projects
          </div>
          <div style={{ fontSize: "11px", color: "var(--text4)", marginTop: "2px" }}>Always building</div>
        </div>

        {/* 2. Educational Progress (Static) */}
        <div
          style={{ flex: 1, padding: "24px 28px", borderRight: "1px solid var(--border)", transition: "background .25s", cursor: "default" }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.02)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "")}
        >
          <div style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", fontStyle: "italic", color: "var(--text)", lineHeight: 1, marginBottom: "5px" }}>3rd</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", letterSpacing: ".12em", textTransform: "uppercase" }}>
            Year engineering
          </div>
          <div style={{ fontSize: "11px", color: "var(--text4)", marginTop: "2px" }}>B.E. AI/ML · 2023–2027</div>
        </div>

        {/* 3. Live Words Written Count */}
        <div
          style={{ flex: 1, padding: "24px 28px", borderRight: "1px solid var(--border)", transition: "background .25s", cursor: "default" }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.02)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "")}
        >
          <div
            ref={wordsRef}
            style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", fontStyle: "italic", color: "var(--text)", lineHeight: 1, marginBottom: "5px" }}
          >
            {liveWords.toLocaleString()}
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", letterSpacing: ".12em", textTransform: "uppercase" }}>
            Words written
          </div>
          <div style={{ fontSize: "11px", color: "var(--text4)", marginTop: "2px" }}>Lab notebook records</div>
        </div>

        {/* 4. Live Diary Streak Count */}
        <div
          style={{ flex: 1, padding: "24px 28px", transition: "background .25s", cursor: "default" }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.02)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "")}
        >
          <div style={{ lineHeight: 1, marginBottom: "5.5px", display: "flex", gap: "10px", alignItems: "center" }}>
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="14" cy="14" r="13" stroke="#c41e3a" strokeWidth="1"/>
              <text fontFamily="'Instrument Serif',serif" fontSize="7" fill="#c41e3a" textAnchor="middle" x="14" y="12" fontStyle="italic">lab</text>
              <text fontFamily="'Geist Mono',monospace" fontSize="4" fill="#c41e3a" textAnchor="middle" x="14" y="20" letterSpacing=".5">active</text>
            </svg>
            <div style={{ fontFamily: "var(--serif)", fontSize: "2.1rem", fontStyle: "italic", color: "var(--text)", lineHeight: 1 }}>
              <span ref={streakRef}>0</span>
            </div>
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", letterSpacing: ".12em", textTransform: "uppercase" }}>
            Lab diary streak
          </div>
          <div style={{ fontSize: "11px", color: "var(--text4)", marginTop: "2px" }}>
            {liveStreak > 0 ? "Daily publishing active" : "Keep writing"}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          #stats-bar-wrapper { margin: 0 28px !important; flex-wrap: wrap; }
          #stats-bar-wrapper > div { min-width: 50%; border-bottom: 1px solid var(--border); }
          #stats-bar-wrapper > div:nth-child(odd) { border-right: 1px solid var(--border); }
        }
        @media (max-width: 680px) {
          #stats-bar-wrapper { margin: 0 20px !important; flex-direction: column; }
          #stats-bar-wrapper > div { border-right: none !important; }
        }
      `}</style>
    </>
  );
}
