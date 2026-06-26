import { Monitor, Moon, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import type { ThemeMode } from "@/hooks/useTheme";

const MODE_ICONS: Record<ThemeMode, LucideIcon> = {
  light: Sun,
  dark: Moon,
  auto: Monitor,
};

const MODE_LABELS: Record<ThemeMode, string> = {
  light: "Light theme",
  dark: "Dark theme",
  auto: "Auto (system) theme",
};

const NEXT_MODE: Record<ThemeMode, ThemeMode> = {
  light: "dark",
  dark: "auto",
  auto: "light",
};

export function ThemeToggle() {
  const { mode, cycle } = useTheme();
  const Icon = MODE_ICONS[mode];
  const label = `${MODE_LABELS[mode]} — click to switch to ${MODE_LABELS[NEXT_MODE[mode]]}`;

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
