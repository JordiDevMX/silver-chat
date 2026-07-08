import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SettingsButtonProps {
  onClick?: () => void;
}

/**
 * Settings trigger — opens the settings sheet.
 *
 * Mirrors the visual rhythm of `ThemeToggle` and `InstallPwaButton` so the
 * three utility controls sit consistently in any header.
 */
export function SettingsButton({ onClick }: SettingsButtonProps) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      aria-label={t("settings.title")}
      onClick={onClick}
      className="h-9 w-9 grid place-items-center rounded-full bg-card/70 border border-border hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Settings className="h-4 w-4" />
    </button>
  );
}
