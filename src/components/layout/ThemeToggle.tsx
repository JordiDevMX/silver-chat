import { Monitor, Moon, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import type { ThemeMode } from "@/hooks/useTheme";

const MODE_ICONS: Record<ThemeMode, LucideIcon> = {
  light: Sun,
  dark: Moon,
  auto: Monitor,
};

const MODE_KEY: Record<ThemeMode, "theme.light" | "theme.dark" | "theme.auto"> = {
  light: "theme.light",
  dark: "theme.dark",
  auto: "theme.auto",
};

const NEXT_MODE: Record<ThemeMode, ThemeMode> = {
  light: "dark",
  dark: "auto",
  auto: "light",
};

export function ThemeToggle() {
  const { mode, cycle } = useTheme();
  const { t } = useTranslation();
  const Icon = MODE_ICONS[mode];
  const label = t("theme.toggleHint", {
    current: t(MODE_KEY[mode]),
    next: t(MODE_KEY[NEXT_MODE[mode]]),
  });

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      title={label}
      className="h-9 w-9 grid place-items-center rounded-full bg-card/70 border border-border hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Icon className="h-4 w-4" strokeWidth={2.2} />
    </button>
  );
}