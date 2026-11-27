import { ThemeProvider, ThemeToggle, type ThemeMode } from "@propermade/core/components";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import "../theme/site.css";
import { flushSync } from "react-dom";

import { siteTheme } from "../theme/site.js";

const key = "theme-mode";
const Ctx = createContext<{ mode: ThemeMode; setMode: (m: ThemeMode) => void }>({
  mode: "system",
  setMode: () => {},
});

/** Holds the color mode. Starts on "system" so server and client markup match, then restores a saved choice. */
export function ThemeShell({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved === "light" || saved === "dark" || saved === "system") setModeState(saved);
    } catch {}
  }, []);
  const setMode = (m: ThemeMode) => {
    const apply = () => {
      setModeState(m);
      try {
        localStorage.setItem(key, m);
      } catch {}
    };
    // Cross-fade the color change where supported, unless the visitor prefers reduced motion.
    if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.startViewTransition(() => flushSync(apply));
    } else apply();
  };
  return (
    <Ctx value={{ mode, setMode }}>
      <ThemeProvider theme={siteTheme} mode={mode}>
        {children}
      </ThemeProvider>
    </Ctx>
  );
}

export function ModeToggle() {
  const { mode, setMode } = useContext(Ctx);
  return <ThemeToggle themeMode={mode} isCollapsed={false} onChange={setMode} />;
}
