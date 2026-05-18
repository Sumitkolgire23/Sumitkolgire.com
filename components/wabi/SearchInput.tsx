"use client";

import React from "react";

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = "Search..." }: SearchInputProps) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Search Icon */}
      <svg
        style={{
          position: "absolute",
          left: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text4)",
          pointerEvents: "none"
        }}
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          color: "var(--text)",
          padding: "8px 12px 8px 34px",
          fontSize: "13px",
          fontFamily: "var(--sans)",
          outline: "none",
          transition: "all 0.2s"
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--seal)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
      />
    </div>
  );
}
