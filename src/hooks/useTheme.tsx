import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "auto";
export type ResolvedTheme = "light" | "dark";

export const ACCENT_IDS = ["blue", "purple", "red", "orange", "yellow", "green"] as const;
export type Accent = (typeof ACCENT_IDS)[number];
const DEFAULT_ACCENT: Accent = "blue";

interface ThemeContextValue {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  cycle: () => void;
  accent: Accent;
  setAccent: (accent: Accent) => void;
}

const MODE_STORAGE_KEY = "theme";
const ACCENT_STORAGE_KEY = "accent";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark" || value === "auto";
}

function isAccent(value: unknown): value is Accent {
  return typeof value === "string" && (ACCENT_IDS as readonly string[]).includes(value);
}

function readStoredMode(): ThemeMode {
  if (typeof window === "undefined") return "auto";
  try {
    const stored = window.localStorage.getItem(MODE_STORAGE_KEY);
    return isThemeMode(stored) ? stored : "auto";
  } catch {
    return "auto";
  }
}

function readStoredAccent(): Accent {
  if (typeof window === "undefined") return DEFAULT_ACCENT;
  try {
    const stored = window.localStorage.getItem(ACCENT_STORAGE_KEY);
    return isAccent(stored) ? stored : DEFAULT_ACCENT;
  } catch {
    return DEFAULT_ACCENT;
  }
}

function resolveMode(mode: ThemeMode): ResolvedTheme {
  if (mode !== "auto") return mode;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const resolved = resolveMode(mode);
  const root = document.documentElement;

  // Always set `data-theme` to the *resolved* value. The dark palette in
  // styles.css lives exclusively under `:root[data-theme="dark"]`, so the
  // attribute MUST be present (and equal to "dark") for dark tokens to
  // apply — regardless of whether the user chose "dark" explicitly or
  // "auto" resolved to dark via the OS media query. Removing the
  // attribute (the old behaviour for `auto`) fell back to the light
  // `:root` palette, breaking auto-dark users on every reload.
  root.setAttribute("data-theme", resolved);
  root.style.colorScheme = resolved;
}

function applyAccent(accent: Accent) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const id of ACCENT_IDS) {
    root.classList.remove(`theme-${id}`);
  }
  root.classList.add(`theme-${accent}`);
}

const CYCLE_ORDER: ThemeMode[] = ["light", "dark", "auto"];

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Lazy initialisers read directly from storage / media query so the
  // hook's FIRST render already matches the pre-hydration `noFlash`
  // script in `__root.tsx`. This kills the one-frame light-flash that
  // would otherwise appear between React mount and the first `useEffect`.
  const [mode, setModeState] = useState<ThemeMode>(() => readStoredMode());
  const [resolved, setResolved] = useState<ResolvedTheme>(() => resolveMode(readStoredMode()));
  const [accent, setAccentState] = useState<Accent>(() => readStoredAccent());

  useEffect(() => {
    // Re-sync in case storage changed between the lazy init and mount
    // (e.g. another tab toggled the theme), and ensure the DOM matches.
    const initialMode = readStoredMode();
    setModeState(initialMode);
    setResolved(resolveMode(initialMode));
    applyTheme(initialMode);

    const initialAccent = readStoredAccent();
    setAccentState(initialAccent);
    applyAccent(initialAccent);
  }, []);

  useEffect(() => {
    if (mode !== "auto") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const next = resolveMode("auto");
      setResolved(next);
      // Keep `data-theme` in lockstep with the resolved value so the dark
      // palette tokens turn over live when the OS theme changes mid-
      // session (not just `colorScheme`).
      document.documentElement.setAttribute("data-theme", next);
      document.documentElement.style.colorScheme = next;
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    setResolved(resolveMode(next));
    applyTheme(next);
    try {
      window.localStorage.setItem(MODE_STORAGE_KEY, next);
    } catch {
      // ignore quota / privacy mode errors
    }
  }, []);

  const setAccent = useCallback((next: Accent) => {
    setAccentState(next);
    applyAccent(next);
    try {
      window.localStorage.setItem(ACCENT_STORAGE_KEY, next);
    } catch {
      // ignore quota / privacy mode errors
    }
  }, []);

  const cycle = useCallback(() => {
    setMode(CYCLE_ORDER[(CYCLE_ORDER.indexOf(mode) + 1) % CYCLE_ORDER.length]);
  }, [mode, setMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, resolved, setMode, cycle, accent, setAccent }),
    [mode, resolved, setMode, cycle, accent, setAccent],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return ctx;
}
