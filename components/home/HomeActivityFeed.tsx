"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  GitCommit,
  Terminal,
  Activity,
  ExternalLink,
  Clock,
  Database,
  Cpu,
  GitBranch
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlowCard } from "@/components/ui/GlowCard";

// ── TYPES ───────────────────────────────────────────────────────────────────
interface CommitItem {
  sha: string;
  message: string;
  date: string;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  url: string;
}

interface ActivityEvent {
  id: string;
  type: "diary" | "idea" | "sys" | "sec";
  timestamp: string;
  text: string;
}

interface HomeActivityFeedProps {
  initialCommits: CommitItem[];
  initialEvents: ActivityEvent[];
}

// ── CUSTOM INLINE SVG GITHUB ICON ──────────────────────────────────────────
const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// ── CUSTOM TYPEWRITER COMPONENT ───────────────────────────────────────────
const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 15); // Fast, fluid typing at 15ms per character

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

// ── CUSTOM GIT BRANCH topologY GRAPH (CONTRIBUTION TREE) ──────────────────
const GitBranchTree = ({ idx }: { idx: number }) => {
  return (
    <div className="w-[30px] self-stretch flex justify-center relative select-none shrink-0 mr-1.5">
      <svg
        className="absolute inset-0 w-full h-full stroke-[1.8] fill-none"
        viewBox="0 0 30 100"
        preserveAspectRatio="none"
      >
        {/* Git tree drawing based on commit index with active packet flow animations */}
        {idx === 0 && (
          <>
            {/* Main track */}
            <line x1="15" y1="0" x2="15" y2="100" className="stroke-seal/40" />
            {/* Branch merge curve from right with active flow */}
            <path
              d="M 25 0 C 25 25, 15 35, 15 50"
              className="stroke-gold/70 animate-[branch-flow_1.8s_infinite_linear]"
              strokeDasharray="4 4"
            />
            {/* glowing main Commit Node */}
            <circle
              cx="15"
              cy="50"
              r="4"
              className="fill-bg stroke-seal stroke-[2] animate-[pulse_2s_infinite]"
              style={{ filter: "drop-shadow(0 0 4px var(--seal))" }}
            />
          </>
        )}
        {idx === 1 && (
          <>
            {/* Main track with active flow */}
            <line
              x1="15"
              y1="0"
              x2="15"
              y2="100"
              className="stroke-seal/70 animate-[branch-flow_2.2s_infinite_linear]"
              strokeDasharray="5 5"
            />
            {/* Parallel Feature Branch track */}
            <line x1="25" y1="0" x2="25" y2="100" className="stroke-gold/40" strokeDasharray="3 3" />
            {/* glowing main Commit Node */}
            <circle
              cx="15"
              cy="50"
              r="4"
              className="fill-bg stroke-seal stroke-[2] animate-[pulse_2s_infinite]"
              style={{ filter: "drop-shadow(0 0 4px var(--seal))" }}
            />
          </>
        )}
        {idx === 2 && (
          <>
            {/* Main track */}
            <line x1="15" y1="0" x2="15" y2="100" className="stroke-seal/40" />
            {/* active Feature Branch track with active flow */}
            <line
              x1="25"
              y1="0"
              x2="25"
              y2="100"
              className="stroke-gold/70 animate-[branch-flow_1.5s_infinite_linear]"
              strokeDasharray="4 4"
            />
            {/* glowing Feature Commit Node */}
            <circle
              cx="25"
              cy="50"
              r="4"
              className="fill-bg stroke-gold stroke-[2] animate-[pulse_2s_infinite]"
              style={{ filter: "drop-shadow(0 0 4px var(--gold))" }}
            />
          </>
        )}
        {idx === 3 && (
          <>
            {/* Main track with active flow */}
            <line
              x1="15"
              y1="0"
              x2="15"
              y2="100"
              className="stroke-seal/70 animate-[branch-flow_2s_infinite_linear]"
              strokeDasharray="5 5"
            />
            {/* Hotfix branch splitting off to left */}
            <path
              d="M 15 30 C 15 45, 5 55, 5 100"
              className="stroke-sky/50 animate-[branch-flow_1.6s_infinite_linear]"
              strokeDasharray="4 4"
            />
            {/* Node on Main */}
            <circle
              cx="15"
              cy="30"
              r="4"
              className="fill-bg stroke-seal stroke-[2] animate-[pulse_2s_infinite]"
              style={{ filter: "drop-shadow(0 0 4px var(--seal))" }}
            />
          </>
        )}
        {idx === 4 && (
          <>
            {/* Main track */}
            <line x1="15" y1="0" x2="15" y2="100" className="stroke-seal/40" />
            {/* Hotfix track parallel with active flow */}
            <line
              x1="5"
              y1="0"
              x2="5"
              y2="50"
              className="stroke-sky/60 animate-[branch-flow_2.5s_infinite_linear]"
              strokeDasharray="4 4"
            />
            {/* Hotfix merge curve back to main */}
            <path d="M 5 50 C 5 70, 15 80, 15 95" className="stroke-sky/40" />
            {/* Node on Main */}
            <circle
              cx="15"
              cy="40"
              r="4"
              className="fill-bg stroke-seal stroke-[2]"
              style={{ filter: "drop-shadow(0 0 4px var(--seal))" }}
            />
          </>
        )}
      </svg>
    </div>
  );
};

// ── CUSTOM OFFLINE-SAFE GITHUB AVATAR COMPONENT ───────────────────────────
const GithubAvatar = ({ avatarUrl, username }: { avatarUrl: string; username: string }) => {
  const [hasError, setHasError] = useState(false);

  // Generate clean initials from the username, e.g. "SK" for "@Sumitkolgire23"
  const initials = username
    ? username.replace(/^@/, "").substring(0, 2).toUpperCase()
    : "SK";

  if (hasError || !avatarUrl) {
    return (
      <div 
        className="w-8 h-8 rounded border border-seal/45 bg-bg2 flex items-center justify-center font-mono text-[9px] font-bold text-seal select-none tracking-normal shadow-[0_0_8px_rgba(196,30,58,0.12)] transition-all duration-300 group-hover:border-seal group-hover:text-text group-hover:shadow-[0_0_12px_rgba(196,30,58,0.25)] relative overflow-hidden"
        title={username}
      >
        <span className="relative z-10">{initials}</span>
        {/* Subtle retro overlay grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(196,30,58,0.08)_0.5px,transparent_0.5px)] bg-[size:3px_3px] pointer-events-none opacity-50" />
      </div>
    );
  }

  return (
    <img
      src={avatarUrl}
      alt={username}
      className="w-8 h-8 rounded border border-border/80 bg-bg transition-all duration-300 group-hover:scale-105 group-hover:border-seal/60"
      onError={() => setHasError(true)}
    />
  );
};

// ── DIAGNOSTIC EVENT POOL FOR SIMULATOR ───────────────────────────────────
const DIAGNOSTIC_POOL = [
  "SYS: [OK] VECTOR DATABASE INDEX RE-CACHED IN 38MS",
  "SYS: [OK] SUPABASE STORAGE CORS POLICIES VALIDATED SUCCESSFULLY",
  "SYS: [INFO] RYUU OS: COGNITIVE REFLECTION TASK INJECTED (DEPTH=4)",
  "SYS: [INFO] NOVELTY SCORE RE-EVALUATED: 96.8% INTELLECTUAL DENSITY",
  "SYS: [SEC] HANKO AUTHENTICATION LOCK AND SESSION SEAL STABLE",
  "SYS: [OK] DRIZZLE MIGRATION snapshot_0005_engaged (14 TABLES SYNCED)",
  "SYS: [INFO] LOCAL NETWORK LATENCY STABLE (ping gateway.local -> 8ms)",
  "SYS: [INFO] AGENT SYSTEM: COMPLETED LEDGER TRANSACTION INTEGRITY AUDIT",
  "SYS: [OK] COMPLETED BACKGROUND SHADOW-DB COMPACTION TASK"
];

export function HomeActivityFeed({
  initialCommits = [],
  initialEvents = []
}: HomeActivityFeedProps) {
  const [commits, setCommits] = useState<CommitItem[]>(initialCommits);
  const [events, setEvents] = useState<ActivityEvent[]>(initialEvents);
  const [socketStatus, setSocketStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [loadingCommits, setLoadingCommits] = useState(initialCommits.length === 0);
  
  // Contributions states
  const [contributions, setContributions] = useState<{ total: number; weeks: any[][] } | null>(null);
  const [loadingContributions, setLoadingContributions] = useState(true);

  // 1. Fetch live commits client-side
  useEffect(() => {
    async function fetchCommits() {
      try {
        const res = await fetch("/api/github/commits");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCommits(data);
          }
        }
      } catch (err) {
        console.error("Failed to load live commits, using fallback:", err);
      } finally {
        setLoadingCommits(false);
      }
    }
    fetchCommits();
  }, []);

  // 2. Fetch contributions data
  useEffect(() => {
    async function fetchContributions() {
      try {
        const res = await fetch("/api/github/contributions");
        if (res.ok) {
          const data = await res.json();
          setContributions(data);
        }
      } catch (err) {
        console.error("Failed to load contributions:", err);
      } finally {
        setLoadingContributions(false);
      }
    }
    fetchContributions();
  }, []);

  // 3. Supabase Realtime subscription for live mutations
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setSocketStatus("disconnected");
      return;
    }

    setSocketStatus("connecting");

    const channel = supabase
      .channel("lab-realtime-activity")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "diary_entries" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const row = payload.new;
            if (row.is_public && !row.deleted_at) {
              const newEvent: ActivityEvent = {
                id: `diary-${row.id}`,
                type: "diary",
                timestamp: row.written_at || new Date().toISOString(),
                text: `DIARY PUBLISHED: "${row.content.substring(0, 50)}..." (+${row.word_count || 0} words)`
              };
              setEvents((prev) => [newEvent, ...prev.slice(0, 9)]);
            }
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ideas" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const row = payload.new;
            if (row.is_public) {
              const newEvent: ActivityEvent = {
                id: `idea-${row.id}`,
                type: "idea",
                timestamp: row.planted_at || new Date().toISOString(),
                text: `IDEA PLANTED: "${row.content.substring(0, 50)}..." (ripeness: ${row.ripeness || "fresh"})`
              };
              setEvents((prev) => [newEvent, ...prev.slice(0, 9)]);
            }
          }
        }
      );

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        setSocketStatus("connected");
      } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
        setSocketStatus("disconnected");
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 4. Client-side Realtime Systems log simulator (Injects dynamic events every 6s)
  useEffect(() => {
    const interval = setInterval(() => {
      const randomLog = DIAGNOSTIC_POOL[Math.floor(Math.random() * DIAGNOSTIC_POOL.length)];
      const isSys = randomLog.includes("[OK]") || randomLog.includes("[INFO]");
      const isSec = randomLog.includes("[SEC]");
      const type = isSys ? ("sys" as const) : isSec ? ("sec" as const) : ("idea" as const);

      const newEvent: ActivityEvent = {
        id: `live-diag-${Date.now()}`,
        type,
        timestamp: new Date().toISOString(),
        text: randomLog
      };

      setEvents((prev) => {
        // Keep logs capped at 10 items
        return [newEvent, ...prev.slice(0, 9)];
      });
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  // Helper relative date formatter
  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    } catch {
      return "recently";
    }
  };

  // Helper timestamp formatter [HH:MM:SS]
  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString("en-IN", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    } catch {
      return "--:--:--";
    }
  };

  // Generate month labels centered above appropriate week indices
  const getMonthLabels = (weeksList: any[][]) => {
    const labels: { text: string; index: number }[] = [];
    let currentMonth = -1;

    weeksList.forEach((week, wIdx) => {
      if (week && week[0]) {
        const firstDay = new Date(week[0].date);
        const month = firstDay.getMonth();
        if (month !== currentMonth) {
          currentMonth = month;
          const monthName = firstDay.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
          if (wIdx < weeksList.length - 2) {
            labels.push({ text: monthName, index: wIdx });
          }
        }
      }
    });

    return labels;
  };

  // Sleek System Background Logs to complement empty state
  const getSystemLogs = () => {
    const today = new Date();
    return [
      { id: "sys-5", timestamp: new Date(today.getTime() - 12000).toISOString(), type: "sys" as const, text: "SYS: [OK] WEBSOCKET PORT 443 STABLE COGNITIVE BRIDGE ACTIVE" },
      { id: "sys-4", timestamp: new Date(today.getTime() - 45000).toISOString(), type: "sec" as const, text: "SYS: [SEC] HANKO SESSION SEAL VALIDATED ON MAIN DOMAIN" },
      { id: "sys-3", timestamp: new Date(today.getTime() - 3600000).toISOString(), type: "sys" as const, text: "SYS: [OK] DIARY ENGINE SYNCED WITH SUPABASE DB HOOKS" },
      { id: "sys-2", timestamp: new Date(today.getTime() - 14400000).toISOString(), type: "sys" as const, text: "SYS: [OK] VECTOR SEARCH INDEX CACHE OPTIMIZED (384D FALLBACK)" },
      { id: "sys-1", timestamp: new Date(today.getTime() - 86400000).toISOString(), type: "sys" as const, text: "SYS: [OK] SYSTEM MAIN BOOT SEQUENCE INITIALIZED SUCCESSFULLY" }
    ];
  };

  const weeks = contributions?.weeks || [];
  const monthLabels = getMonthLabels(weeks);
  const totalContributions = contributions?.total || 0;
  const activeEvents = events.length > 0 ? events : getSystemLogs();

  return (
    <section
      id="activity-feed"
      className="page-section animate-crt-flicker"
      style={{
        borderBottom: "1px solid var(--border)",
        padding: "80px 40px",
        position: "relative"
      }}
    >
      {/* Decorative letter background */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: "200px",
          color: "rgba(255,255,255,.008)",
          pointerEvents: "none",
          userSelect: "none",
          left: "28px",
          top: "32px",
          lineHeight: 1
        }}
      >
        A
      </div>

      <div className="section-container">
        
        {/* Header bar */}
        <div
          className="reveal"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "36px",
            paddingBottom: "14px",
            borderBottom: "1px solid var(--border)"
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
            <span style={{ fontFamily: "var(--serif)", fontSize: "2.8rem", fontStyle: "italic", color: "rgba(255,255,255,.03)", lineHeight: 1 }}>03</span>
            <div>
              <span className="section-title" style={{ fontSize: "1.05rem", fontWeight: 500, color: "var(--text)" }}>System Live Feed</span>
              <span style={{ display: "block", fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", marginTop: "3px", letterSpacing: ".1em", textTransform: "uppercase" }}>GitHub builds + Supabase Database hooks</span>
            </div>
          </div>

          {/* Realtime network status */}
          <div className="flex items-center gap-2 bg-bg3/60 backdrop-blur-md px-3.5 py-1.5 border border-border/80 rounded font-mono text-[9px] tracking-wider select-none shadow-sm shadow-black/10">
            <span className="relative flex h-2 w-2">
              <span
                className={cn(
                  "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                  socketStatus === "connected" && "bg-ok",
                  socketStatus === "connecting" && "bg-warn",
                  socketStatus === "disconnected" && "bg-danger"
                )}
              />
              <span
                className={cn(
                  "relative inline-flex rounded-full h-2 w-2",
                  socketStatus === "connected" && "bg-ok",
                  socketStatus === "connecting" && "bg-warn",
                  socketStatus === "disconnected" && "bg-danger"
                )}
              />
            </span>
            <span className="text-text3 font-semibold font-mono tracking-widest text-[9px]">
              {socketStatus === "connected" && "WS LINK ACTIVE"}
              {socketStatus === "connecting" && "WS CONNECTING..."}
              {socketStatus === "disconnected" && "WS OFFLINE"}
            </span>
          </div>
        </div>

        {/* Dashboard Rows */}
        <div className="flex flex-col gap-8 relative z-10">
          
          {/* Top Row: Commits and Event Log Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* LEFT: Live Build Feed with Git Branch Graph (Contribution Tree) */}
            <div className="flex flex-col bg-bg2/25 backdrop-blur-lg border border-border/70 rounded p-5 h-[410px] shadow-lg shadow-black/35 hover:border-border/100 hover:shadow-[0_0_20px_rgba(196,30,58,0.03)] transition-all duration-300">
              <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4 shrink-0">
                <div className="flex items-center gap-2.5">
                  <GitCommit className="w-4 h-4 text-seal animate-pulse" />
                  <h3 className="font-mono text-xs font-semibold tracking-widest text-text2 uppercase">
                    Build Activity & Branch Tree
                  </h3>
                </div>
                <span className="font-mono text-[9px] text-text4 font-medium uppercase tracking-wider bg-bg3/80 px-2 py-0.5 border border-border/40 rounded">
                  Live topology
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1.5 scrollbar-thin select-none">
                {loadingCommits ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2.5 text-text4">
                    <div className="w-5 h-5 border border-t-transparent border-seal animate-spin rounded-full" />
                    <span className="font-mono text-[9px] tracking-widest uppercase animate-pulse">Syncing GitHub...</span>
                  </div>
                ) : (
                  commits.map((commit, idx) => (
                    <GlowCard
                      key={commit.sha}
                      className={cn(
                        "group border border-border/30 hover:border-border/60 hover:-translate-y-[1px] p-3.5 rounded bg-bg3/15 backdrop-blur-sm transition-all duration-300 flex gap-3 items-stretch shadow-sm cursor-pointer",
                        "animate-ink-fade"
                      )}
                      style={{ animationDelay: `${idx * 40}ms` }}
                    >
                      {/* Visual Contribution tree element on left of each commit */}
                      <GitBranchTree idx={idx} />
                      
                      {/* Visual Avatar container centered vertically and restricted from stretching */}
                      <div className="w-8 h-8 relative shrink-0 select-none self-center flex items-center justify-center">
                        <GithubAvatar avatarUrl={commit.author.avatar} username={commit.author.username} />
                        <div className="absolute inset-0 rounded border border-seal/0 group-hover:border-seal/40 transition-colors duration-300 pointer-events-none" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2.5 mb-1">
                          <span className="font-mono text-[10px] text-text3 font-semibold truncate hover:text-text transition-colors">
                            @{commit.author.username}
                          </span>
                          <span className="font-mono text-[9px] text-text4 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-text4" />
                            {formatRelativeTime(commit.date)}
                          </span>
                        </div>
                        <p className="text-[12px] font-sans text-text2 leading-relaxed line-clamp-2 pr-1 mb-2 font-medium tracking-normal">
                          {commit.message}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-border/20">
                          <span className="font-mono text-[9px] text-text4 select-all bg-bg/85 border border-border/30 px-2 py-0.5 rounded font-semibold tracking-wide">
                            {commit.sha.substring(0, 7)}
                          </span>
                          <a
                            href={commit.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[9.5px] text-seal hover:text-white flex items-center gap-1 group-hover:translate-x-0.5 transition-all font-semibold"
                          >
                            diff
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    </GlowCard>
                  ))
                )}
              </div>
            </div>

            {/* RIGHT: Live Database Activity Log styled as a retro CRT monitor */}
            <div className="flex flex-col bg-bg2/25 backdrop-blur-lg border border-border/70 rounded p-5 h-[410px] shadow-lg shadow-black/35 hover:border-border/100 hover:shadow-[0_0_20px_rgba(200,169,110,0.03)] transition-all duration-300 relative overflow-hidden group">
              {/* Subtle CRT Flicker Screen Layer */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.005)_0%,transparent_100%)] pointer-events-none z-10 select-none animate-[crt-flicker_0.15s_infinite]" />
              
              <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4 shrink-0 relative z-20">
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-gold" />
                  <h3 className="font-mono text-xs font-semibold tracking-widest text-text2 uppercase">
                    Lab Event Stream
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[8px] text-text4 bg-bg3/80 border border-border/40 px-2 py-0.5 rounded select-none">
                  <Cpu className="w-2.5 h-2.5 text-gold/80" />
                  <span>ACTIVE CORES: 12</span>
                </div>
              </div>

              {/* Event logs terminal styling */}
              <div className="flex-1 bg-bg/95 border border-border/80 rounded p-4 font-mono text-[11px] leading-relaxed overflow-y-auto scrollbar-thin flex flex-col-reverse justify-end gap-3.5 select-text relative shadow-inner z-20">
                {/* Micro Scanline effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 pointer-events-none select-none" />
                
                {activeEvents.map((ev, idx) => (
                  <div 
                    key={ev.id} 
                    className="flex gap-2.5 items-start animate-fade-in relative z-10 border-b border-border/5 pb-2 last:border-0"
                  >
                    <span className="text-text4 font-semibold select-none shrink-0 font-mono tracking-tight text-[10px]">
                      [{formatTimestamp(ev.timestamp)}]
                    </span>
                    <span
                      className={cn(
                        "font-bold select-none shrink-0 text-[10px] tracking-wide",
                        ev.type === "diary" && "text-seal",
                        ev.type === "idea" && "text-gold",
                        ev.type === "sys" && "text-sky",
                        ev.type === "sec" && "text-moss"
                      )}
                    >
                      {ev.type === "diary" && "[DIARY]"}
                      {ev.type === "idea" && "[IDEA]"}
                      {ev.type === "sys" && "[SYS]"}
                      {ev.type === "sec" && "[AUTH]"}
                    </span>
                    <span className="text-text2 font-semibold font-mono break-all leading-normal">
                      {/* Apply typewriter simulation solely to the newest event to keep it lively yet performant! */}
                      {idx === 0 ? <TypewriterText text={ev.text} /> : ev.text}
                    </span>
                  </div>
                ))}

                {/* Console Welcome Message */}
                <div className="text-text4 select-none border-b border-border/30 pb-2.5 flex items-center justify-between font-mono text-[9.5px]">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gold" />
                    </span>
                    <span>SYS: WEBSOCKET STREAM ACTIVE ON PORT 443</span>
                  </div>
                  <span className="typewriter-cursor" />
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row: Full Width GitHub Contribution Calendar */}
          <div className="bg-bg2/20 backdrop-blur-lg border border-border/60 hover:border-border/90 rounded p-5 shadow-lg shadow-black/10 transition-all duration-300">
            <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <GithubIcon className="w-4 h-4 text-text" />
                <h3 className="font-mono text-xs font-semibold tracking-widest text-text uppercase flex items-center gap-2">
                  GitHub Contribution Activity 
                  <span className="text-[10px] font-normal text-text4 lowercase font-mono">
                    (@Sumitkolgire23)
                  </span>
                </h3>
              </div>
              <a 
                href="https://github.com/Sumitkolgire23" 
                target="_blank" 
                rel="noreferrer noopener" 
                className="font-mono text-[9px] text-seal hover:text-white flex items-center gap-1 select-none font-bold"
              >
                profile ↗
              </a>
            </div>

            {loadingContributions ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-text4 select-none">
                <div className="w-4 h-4 border border-t-transparent border-seal animate-spin rounded-full" />
                <span className="font-mono text-[9px] tracking-widest uppercase animate-pulse">Syncing Contributions...</span>
              </div>
            ) : (
              <div className="w-full">
                {/* Horizontal Scroll wrapper for responsive grid */}
                <div className="overflow-x-auto scrollbar-thin pb-2" style={{ scrollbarWidth: "thin" }}>
                  <div className="flex gap-[3.5px] select-none min-w-[760px] p-1">
                    
                    {/* Days Column */}
                    <div className="flex flex-col justify-between text-[9px] font-mono text-text4 pr-2.5 pt-[16px] select-none h-[88px] leading-[9.5px]">
                      <span>Mon</span>
                      <span>Wed</span>
                      <span>Fri</span>
                    </div>

                    {/* Main Grid Column */}
                    <div className="flex-1">
                      {/* Months Row */}
                      <div className="relative h-[16px] text-[9px] font-mono text-text4 mb-[5px] select-none">
                        {monthLabels.map((lbl, idx) => {
                          const leftPos = lbl.index * 13.5;
                          return (
                            <span key={idx} className="absolute" style={{ left: `${leftPos}px` }}>
                              {lbl.text}
                            </span>
                          );
                        })}
                      </div>

                      {/* Contribution Grid */}
                      <div className="flex gap-[3.5px] h-[88px]">
                        {weeks.map((week, wIdx) => (
                          <div key={wIdx} className="flex flex-col gap-[3.5px]">
                            {week.map((day, dIdx) => {
                              // Dynamic Obsidian Green Custom Palette
                              let cellColor = "var(--bg3)";
                              if (day.contributionCount > 0) {
                                if (day.contributionCount < 5) cellColor = "rgba(61, 139, 58, 0.22)";
                                else if (day.contributionCount < 12) cellColor = "rgba(61, 139, 58, 0.45)";
                                else if (day.contributionCount < 22) cellColor = "rgba(61, 139, 58, 0.72)";
                                else cellColor = "var(--moss)";
                              }

                              return (
                                <div
                                  key={dIdx}
                                  className="w-[9.5px] h-[9.5px] rounded-[1.5px] border border-border/10 cursor-pointer relative group transition-all duration-150 hover:scale-[1.35] hover:z-20 hover:border-text2 hover:shadow-[0_0_10px_rgba(61,139,58,0.7)]"
                                  style={{ backgroundColor: cellColor }}
                                >
                                  {/* Custom Tooltip */}
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[210px] bg-bg/95 border border-border/80 text-[9px] font-mono text-text px-2.5 py-1.5 rounded shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-30 flex flex-col gap-0.5 select-none">
                                    <span className="font-bold text-text tracking-wide">
                                      {day.contributionCount} contribution{day.contributionCount === 1 ? "" : "s"}
                                    </span>
                                    <span className="text-text4 text-[8px]">
                                      {new Date(day.date).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                </div>

                {/* Calendar Footer Info & Legend */}
                <div className="flex flex-col sm:flex-row items-center justify-between text-[9px] font-mono text-text4 mt-3 pt-3 border-t border-border/20 gap-2 select-none">
                  <div className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-text4" />
                    <span>
                      Total contributions (past 365 days): <strong className="text-text font-semibold">{totalContributions}</strong>
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span>Less</span>
                    <div className="w-[9px] h-[9px] rounded-[1.5px] bg-bg3 border border-border/10" />
                    <div className="w-[9px] h-[9px] rounded-[1.5px] bg-[rgba(61,139,58,0.22)] border border-border/10" />
                    <div className="w-[9px] h-[9px] rounded-[1.5px] bg-[rgba(61,139,58,0.45)] border border-border/10" />
                    <div className="w-[9px] h-[9px] rounded-[1.5px] bg-[rgba(61,139,58,0.72)] border border-border/10" />
                    <div className="w-[9px] h-[9px] rounded-[1.5px] bg-[var(--moss)] border border-border/10" />
                    <span>More</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Embedded High-Tech Animation Keyframes */}
      <style>{`
        @keyframes crt-flicker {
          0% { opacity: 0.985; }
          50% { opacity: 1; }
          100% { opacity: 0.99; }
        }
        @keyframes branch-flow {
          to {
            stroke-dashoffset: -20;
          }
        }
      `}</style>
    </section>
  );
}
