import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { InstallPwaButton } from "@/components/layout/InstallPwaButton";
import { SettingsButton } from "@/components/layout/SettingsButton";
import { cn } from "@/lib/utils";

interface PaneHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  /** Optional trailing actions (e.g. sort/view toggles). */
  trailing?: React.ReactNode;
  /** Opens the settings sheet. */
  onOpenSettings?: () => void;
}

/**
 * Compact header used inside the desktop split-view chat list pane.
 * Mirrors the visual language of `AppHeader` but is denser and lives
 * inside the column rather than at the top of the page.
 */
export function PaneHeader({
  search,
  onSearchChange,
  placeholder,
  trailing,
  onOpenSettings,
}: PaneHeaderProps) {
  return (
    <div className="sticky top-0 z-20 border-b border-border/60 bg-gradient-silver/95 backdrop-blur-xl shadow-silver">
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        <h1 className="text-base font-semibold tracking-tight">Chats</h1>
        <div className="ml-auto flex items-center gap-1">
          {trailing}
          <ThemeToggle />
          <SettingsButton onClick={onOpenSettings} />
          <InstallPwaButton />
        </div>
      </div>
      <div className="px-3 pb-3">
        <label
          className={cn(
            "flex items-center gap-2 h-9 rounded-full bg-card/80 border border-border px-3",
            "focus-within:ring-2 focus-within:ring-ring focus-within:border-ring transition",
          )}
        >
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder ?? "Search conversations…"}
            className="flex-1 bg-transparent outline-hidden text-sm placeholder:text-muted-foreground"
          />
        </label>
      </div>
    </div>
  );
}
