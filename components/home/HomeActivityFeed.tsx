"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  GitCommit,
  Terminal,
  Activity,
  Wifi,
  WifiOff,
  ExternalLink,
  Clock,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  type: "diary" | "idea";
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

  // 2. Supabase Realtime subscription for live mutations
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

  return (
    <section
      id="activity-feed"
      className="page-section"
      style={{
        borderBottom: "1px solid var(--border)",
        padding: "60px 40px",
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
          color: "rgba(255,255,255,.012)",
          pointerEvents: "none",
          userSelect: "none",
          left: "28px",
          top: "32px",
          lineHeight: 1
        }}
      >
        A
      </div>

      <div className="section-container" style={{ maxWidth: "var(--site-width)", margin: "0 auto" }}>
        
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
            <span style={{ fontFamily: "var(--serif)", fontSize: "2.8rem", fontStyle: "italic", color: "rgba(255,255,255,.04)", lineHeight: 1 }}>03</span>
            <div>
              <span className="section-title" style={{ fontSize: "1.05rem", fontWeight: 500, color: "var(--text)" }}>System Live Feed</span>
              <span style={{ display: "block", fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", marginTop: "3px", letterSpacing: ".1em", textTransform: "uppercase" }}>GitHub builds + Supabase Database hooks</span>
            </div>
          </div>

          {/* Realtime network status */}
          <div className="flex items-center gap-2 bg-bg3/70 px-3 py-1 border border-border rounded font-mono text-[9px] tracking-wide select-none">
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
            <span className="text-text3 text-[9px] font-semibold">
              {socketStatus === "connected" && "WS LINK ACTIVE"}
              {socketStatus === "connecting" && "WS CONNECTING..."}
              {socketStatus === "disconnected" && "WS OFFLINE"}
            </span>
          </div>
        </div>

        {/* Two Columns Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          
          {/* LEFT: Live Build Feed (commits) */}
          <div className="flex flex-col bg-bg2/45 border border-border rounded p-4 h-[380px]">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2 mb-3 shrink-0">
              <GitCommit className="w-4 h-4 text-seal" />
              <h3 className="font-mono text-xs font-semibold tracking-wider text-text2 uppercase">
                Build Activity (Commits)
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
              {loadingCommits ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-text4">
                  <div className="w-4 h-4 border border-t-transparent border-seal animate-spin rounded-full" />
                  <span className="font-mono text-[9px] tracking-widest uppercase">Syncing GitHub...</span>
                </div>
              ) : (
                commits.map((commit) => (
                  <div
                    key={commit.sha}
                    className="group border border-border/40 hover:border-border p-2.5 rounded bg-bg3/30 transition-all flex gap-3 items-start"
                  >
                    <img
                      src={commit.author.avatar}
                      alt={commit.author.username}
                      className="w-7 h-7 rounded border border-border shrink-0 select-none bg-bg"
                      onError={(e) => {
                        e.currentTarget.src = "https://github.com/identicons/sumit.png";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-mono text-[10px] text-text3 font-semibold truncate hover:text-ink transition-colors">
                          @{commit.author.username}
                        </span>
                        <span className="font-mono text-[9px] text-text4 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {formatRelativeTime(commit.date)}
                        </span>
                      </div>
                      <p className="text-[12px] font-sans text-text2 leading-normal line-clamp-2 pr-1 mb-2 font-medium">
                        {commit.message}
                      </p>
                      <div className="flex items-center justify-between pt-1.5 border-t border-border/30">
                        <span className="font-mono text-[9px] text-text4 select-all bg-bg border border-border/40 px-1.5 py-0.5 rounded">
                          {commit.sha.substring(0, 7)}
                        </span>
                        <a
                          href={commit.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[9px] text-seal hover:text-white flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
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
          <div className="flex flex-col bg-bg2/45 border border-border rounded p-4 h-[380px]">
            <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-gold" />
                <h3 className="font-mono text-xs font-semibold tracking-wider text-text2 uppercase">
                  Lab Event Stream
                </h3>
              </div>
              <Activity className="w-3.5 h-3.5 text-text4 animate-pulse" />
            </div>

            {/* Event logs terminal styling */}
            <div className="flex-1 bg-bg/95 border border-border/80 rounded p-3 font-mono text-[11px] leading-relaxed overflow-y-auto scrollbar-thin flex flex-col-reverse justify-end gap-2.5 select-text">
              {events.length === 0 ? (
                <div className="text-text4 text-center py-10 tracking-widest uppercase">
                  [ No stream logs cached ]
                </div>
              ) : (
                events.map((ev) => (
                  <div key={ev.id} className="flex gap-2 items-start animate-fade-in">
                    <span className="text-text4 select-none">
                      [{formatTimestamp(ev.timestamp)}]
                    </span>
                    <span
                      className={cn(
                        "font-bold select-none shrink-0",
                        ev.type === "diary" ? "text-seal" : "text-gold"
                      )}
                    >
                      {ev.type === "diary" ? "[DIARY]" : "[IDEA]"}
                    </span>
                    <span className="text-text2 font-medium break-all">
                      {ev.text}
                    </span>
                  </div>
                ))
              )}

              {/* Console Welcome Message */}
              <div className="text-text4 select-none border-b border-border/20 pb-2">
                SYS: WEBSOCKET EVENT INJECTOR ACTIVE (PORT 443)
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
