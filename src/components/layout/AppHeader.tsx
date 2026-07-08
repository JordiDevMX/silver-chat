import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { InstallPwaButton } from "@/components/layout/InstallPwaButton";
import { SettingsButton } from "@/components/layout/SettingsButton";
import { cn } from "@/lib/utils";

export interface AppHeaderSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

interface AppHeaderProps extends AppHeaderSearchProps {
  onOpenSettings?: () => void;
  /** Optional title for context-specific screens (e.g. chat conversation). */
  title?: string;
  /** Optional back affordance — mobile conversation view uses it. */
  back?: {
    label: string;
    onBack: () => void;
  };
}

/**
 * Cross-breakpoint application header.
 *
 *  - On the home view (title + search): shows brand mark, search, settings.
 *  - On a conversation view (back + title): the brand row is hidden and the
 *    back arrow + screen title are rendered instead, on all breakpoints.
 *
 * The header is always sticky to the top of its scrolling container; the
 * ResponsiveShell passes that container as the parent of the main slot.
 */
export function AppHeader({
  search,
  onSearchChange,
  placeholder,
  onOpenSettings,
  title,
  back,
}: AppHeaderProps) {
  const { t } = useTranslation();
  if (back || title) {
    return (
      <header
        suppressHydrationWarning
        className="sticky top-0 z-30 border-b border-border/60 bg-gradient-silver/90 backdrop-blur-xl shadow-silver"
      >
        <div className="flex items-center gap-2 px-3 py-2.5">
          {back ? (
            <button
              type="button"
              aria-label={back.label}
              onClick={back.onBack}
              className="h-9 w-9 grid place-items-center rounded-full hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <BackGlyph className="h-5 w-5" />
            </button>
          ) : null}
          <h2 className="flex-1 min-w-0 truncate text-sm font-semibold tracking-tight">{title}</h2>
        </div>
      </header>
    );
  }

  return (
    <header
      suppressHydrationWarning
      className="sticky top-0 z-30 bg-gradient-silver border-b border-border/60 backdrop-blur-xl shadow-silver"
    >
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 rounded-xl bg-gradient-neon shadow-glow grid place-items-center">
            <span className="text-primary-foreground font-bold text-sm tracking-tight">S</span>
            <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/30" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">
            Silver<span className="text-neon">Chat</span>
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <SettingsButton onClick={onOpenSettings} />
          <InstallPwaButton />
        </div>
      </div>
      <div className="px-4 pb-3">
        <label
          className={cn(
            "flex items-center gap-2 h-10 rounded-full bg-card/80 border border-border px-4",
            "focus-within:ring-2 focus-within:ring-ring focus-within:border-ring transition",
          )}
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder ?? t("search.conversations")}
            className="flex-1 bg-transparent outline-hidden text-sm placeholder:text-muted-foreground"
          />
        </label>
      </div>
    </header>
  );
}

function BackGlyph({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
