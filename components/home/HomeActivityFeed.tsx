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

  // 1. Fetch live commits client-side (to keep it ultra-fresh)
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
          // Avoid labels bunching at the very end
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
      className="page-section"
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
          color: "rgba(255,255,255,.01)",
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
            
            {/* LEFT: Live Build Feed (commits) */}
            <div className="flex flex-col bg-bg2/30 backdrop-blur-lg border border-border/70 rounded p-5 h-[390px] shadow-lg shadow-black/20 hover:border-border transition-all duration-300">
              <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4 shrink-0">
                <div className="flex items-center gap-2.5">
                  <GitCommit className="w-4 h-4 text-seal animate-pulse" />
                  <h3 className="font-mono text-xs font-semibold tracking-widest text-text2 uppercase">
                    Build Activity (Commits)
                  </h3>
                </div>
                <span className="font-mono text-[9px] text-text4 font-medium uppercase tracking-wider bg-bg3/80 px-2 py-0.5 border border-border/40 rounded">
                  Live Sync
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
                    <div
                      key={commit.sha}
                      className={cn(
                        "group border border-border/30 hover:border-border/80 hover:-translate-y-[1px] p-3 rounded bg-bg3/20 backdrop-blur-sm transition-all duration-300 flex gap-3.5 items-start shadow-sm",
                        "animate-ink-fade"
                      )}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={commit.author.avatar}
                          alt={commit.author.username}
                          className="w-8 h-8 rounded border border-border/80 select-none bg-bg transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = "https://github.com/identicons/sumit.png";
                          }}
                        />
                        <div className="absolute inset-0 rounded border border-seal/0 group-hover:border-seal/45 transition-colors duration-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2.5 mb-1.5">
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
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* RIGHT: Live Database Activity Log */}
            <div className="flex flex-col bg-bg2/30 backdrop-blur-lg border border-border/70 rounded p-5 h-[390px] shadow-lg shadow-black/20 hover:border-border transition-all duration-300">
              <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4 shrink-0">
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
              <div className="flex-1 bg-bg/95 border border-border/80 rounded p-4 font-mono text-[11px] leading-relaxed overflow-y-auto scrollbar-thin flex flex-col-reverse justify-end gap-3 select-text relative shadow-inner">
                {/* Micro Scanline effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none select-none" />
                
                {activeEvents.map((ev, idx) => (
                  <div 
                    key={ev.id} 
                    className="flex gap-2.5 items-start animate-fade-in relative z-10 border-b border-border/5 pb-1.5 last:border-0"
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
                      {ev.text}
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
                                  className="w-[9.5px] h-[9.5px] rounded-[1.5px] border border-border/10 cursor-pointer relative group transition-transform duration-100 hover:scale-[1.3] hover:z-20 hover:border-text3"
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
                    <GitBranch className="w-3.5 h-3.5 text-text4" />
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
    </section>
  );
}
