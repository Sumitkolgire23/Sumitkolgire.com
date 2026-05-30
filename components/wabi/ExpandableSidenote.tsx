"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ExpandableSidenoteProps {
  children: React.ReactNode;
  id?: string;
}

export function ExpandableSidenote({ children, id }: ExpandableSidenoteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <span className="sidenote-wrapper" id={id}>
      {/* Clickable superscript trigger */}
      <button
        onClick={toggleOpen}
        className={cn("sidenote-trigger", isOpen && "active")}
        aria-expanded={isOpen}
        aria-label="Sidenote reference"
        type="button"
      >
        †
      </button>

      {/* Sidenote content block */}
      <span
        className={cn("sidenote", isOpen && "open", mounted && "hydrated")}
        role="note"
      >
        {children}
      </span>
    </span>
  );
}
export default ExpandableSidenote;
