import { ThemeProvider, ThemeToggle, type ThemeMode } from "@propermade/core/base";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const key = "theme-mode";
const Ctx = createContext<{ mode: ThemeMode; setMode: (m: ThemeMode) => void }>({
  mode: "system",
  setMode: () => {},
});

/** Holds the colour mode. Starts on "system" so server and client markup match, then restores a saved choice. */
export function ThemeShell({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved === "light" || saved === "dark" || saved === "system") setModeState(saved);
    } catch {}
  }, []);
  const setMode = (m: ThemeMode) => {
    setModeState(m);
    try {
      localStorage.setItem(key, m);
    } catch {}
  };
  return (
    <Ctx value={{ mode, setMode }}>
      <ThemeProvider mode={mode}>{children}</ThemeProvider>
    </Ctx>
  );
}

export function ModeToggle() {
  const { mode, setMode } = useContext(Ctx);
  return <ThemeToggle themeMode={mode} isCollapsed={false} onChange={setMode} />;
}
