"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";

interface LabShellContextType {
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  hasPanel: boolean;
  setHasPanel: (has: boolean) => void;
}

const LabShellContext = createContext<LabShellContextType | undefined>(undefined);

export function useLabShell() {
  const context = useContext(LabShellContext);
  if (!context) {
    throw new Error("useLabShell must be used within a LabShellClient provider");
  }
  return context;
}

export function LabShellClient({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [hasPanel, setHasPanel] = useState(false);
  const pathname = usePathname();

  // Close both drawers automatically when navigating to a new path
  useEffect(() => {
    setNavOpen(false);
    setPanelOpen(false);
  }, [pathname]);

  return (
    <LabShellContext.Provider
      value={{
        navOpen,
        setNavOpen,
        panelOpen,
        setPanelOpen,
        hasPanel,
        setHasPanel,
      }}
    >
      <div
        className={`lab-shell ${navOpen ? "nav-drawer-open" : ""} ${
          panelOpen ? "panel-drawer-open" : ""
        }`}
      >
        {children}
        
        {/* Backdrop for mobile overlays */}
        {(navOpen || panelOpen) && (
          <div
            onClick={() => {
              setNavOpen(false);
              setPanelOpen(false);
            }}
            style={{
              position: "fixed",
              inset: "48px 0 0 0",
              background: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(4px)",
              zIndex: 900,
              cursor: "pointer",
            }}
          />
        )}
      </div>
    </LabShellContext.Provider>
  );
}
