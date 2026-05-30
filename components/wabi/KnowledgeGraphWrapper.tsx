"use client";

import dynamic from "next/dynamic";
import React from "react";

export const KnowledgeGraphWrapper = dynamic(
  () => import("./KnowledgeGraph").then((mod) => mod.KnowledgeGraph),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex flex-col items-center justify-center text-ink-mid border border-border bg-bg2/45 rounded animate-pulse"
        style={{ height: "78vh" }}
      >
        <div className="w-8 h-8 rounded-full border border-t-transparent border-seal animate-spin mb-4" />
        <span className="font-mono text-xs text-text3 tracking-widest uppercase">
          Initializing Canvas coordinates...
        </span>
      </div>
    ),
  }
);
