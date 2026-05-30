"use client";

import Link from "next/link";
import React from "react";
import { Terminal, Home, BookOpen, WifiOff } from "lucide-react";

export default function NotFound() {
  return (
    <section
      className="page-section min-h-[85vh] flex flex-col items-center justify-center text-center relative overflow-hidden select-none"
      style={{
        padding: "80px 20px",
        background: "transparent",
      }}
    >
      {/* Immersive CRT Cyber-Terminal Graphic */}
      <div className="relative w-full max-w-[420px] aspect-[4/3] bg-bg/85 border border-border/80 rounded-lg p-5 mb-8 shadow-2xl shadow-black/60 overflow-hidden group">
        {/* Glow scanlines & CRTs styling */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_0%,transparent_100%)] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 pointer-events-none" />
        
        {/* CRT Scanline Horizontal Line Sweeper */}
        <div className="absolute left-0 w-full h-[1.5px] bg-seal/20 top-0 animate-[scanline_6s_linear_infinite] pointer-events-none" />

        {/* Glitch Overlay Effect */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15),rgba(0,0,0,0.15)_1px,transparent_1px,transparent_2px)] opacity-30 pointer-events-none" />

        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-border/40 pb-2.5 mb-4 shrink-0 font-mono text-[9px] text-text4">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-danger" />
            </span>
            <span className="font-bold tracking-widest text-[9.5px]">SYS_STATUS: ERROR_404</span>
          </div>
          <span>PORT: 404</span>
        </div>

        {/* Inner Terminal screen */}
        <div className="h-full flex flex-col justify-between font-mono text-left relative z-10 pt-1">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-seal text-xs font-semibold select-none border border-seal/30 bg-seal/5 px-2 py-1 rounded w-max animate-pulse">
              <WifiOff className="w-3.5 h-3.5 shrink-0" />
              <span>LINK_FAILED // CONNECTION_LOST</span>
            </div>

            {/* Matrix / Lost Radar Animation */}
            <div className="flex justify-center py-4 select-none">
              <svg
                viewBox="0 0 100 60"
                className="w-48 h-auto opacity-75 stroke-seal text-seal fill-none"
                strokeWidth="1.2"
                strokeLinecap="round"
              >
                {/* Radar Grid circles */}
                <circle cx="50" cy="30" r="26" strokeDasharray="3 3" className="stroke-border/40" />
                <circle cx="50" cy="30" r="16" className="stroke-border/20" />
                <circle cx="50" cy="30" r="6" className="stroke-border/20" />
                
                {/* Crosshairs */}
                <line x1="50" y1="2" x2="50" y2="58" strokeDasharray="2 4" className="stroke-border/30" />
                <line x1="22" y1="30" x2="78" y2="30" strokeDasharray="2 4" className="stroke-border/30" />

                {/* Radar Sweep arm */}
                <line 
                  x1="50" 
                  y1="30" 
                  x2="50" 
                  y2="4" 
                  className="stroke-seal/80 origin-[50px_30px] animate-[spin_4s_linear_infinite]" 
                />

                {/* Lost Node Blip */}
                <circle 
                  cx="65" 
                  cy="18" 
                  r="2" 
                  className="fill-seal stroke-none animate-[pulse_1.5s_infinite]" 
                />
              </svg>
            </div>

            <div className="text-[10px] text-text3 space-y-1.5 leading-normal">
              <div>&gt; REQUEST_URI: <span className="text-text2">UNKNOWN_RESOURCE</span></div>
              <div>&gt; HOSTNAME: <span className="text-text2">SUMITKOLGIRE_LAB</span></div>
              <div>&gt; SECTOR: <span className="text-text2">CORE_ROUTING_OUT_OF_BOUNDS</span></div>
            </div>
          </div>

          <div className="border-t border-border/20 pt-2 flex items-center justify-between text-[8px] text-text4 select-none">
            <span>SYS: INITIALIZING SEARCH SEQUENCE...</span>
            <span className="typewriter-cursor shrink-0" />
          </div>
        </div>
      </div>

      {/* Main Title & Copy */}
      <h1 className="reveal font-serif font-normal text-clamp-2 leading-tight tracking-normal mb-3 text-text">
        404 — Node Disconnected
      </h1>
      
      <p className="reveal text-text3 text-sm leading-relaxed max-w-[42ch] mb-8 font-medium italic">
        The page you are looking for has shifted coordinates or remains classified. The lab is constantly evolving — returning to base is recommended.
      </p>

      {/* Premium Highly Visible CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full sm:w-auto">
        <Link
          href="/"
          className="group flex items-center justify-center gap-2 w-full sm:w-auto bg-[var(--seal)] hover:bg-text hover:text-bg text-white font-mono font-bold tracking-wider rounded border border-seal shadow-lg shadow-seal/20 hover:shadow-white/5 px-7 py-3.5 transform hover:-translate-y-0.5 active:translate-y-0 duration-200 transition-all text-xs uppercase"
        >
          <Home className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Back to Home Base
        </Link>

        <Link
          href="/articles"
          className="group flex items-center justify-center gap-2 w-full sm:w-auto bg-bg3/40 hover:bg-bg3 border border-border/80 text-text3 hover:text-text font-mono font-semibold tracking-wider rounded px-7 py-3.5 transform hover:-translate-y-0.5 active:translate-y-0 duration-200 transition-all text-xs uppercase"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Browse Articles
        </Link>
      </div>

      {/* Animations keyframes styled inside */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(280px); }
        }
      `}</style>
    </section>
  );
}
