import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SettingsButton } from "@/components/layout/SettingsButton";

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  onOpenSettings?: () => void;
}

export function Header({ search, onSearchChange, placeholder, onOpenSettings }: HeaderProps) {
  const { t } = useTranslation();
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
        </div>
      </div>
      <div className="px-4 pb-3">
        <label className="flex items-center gap-2 h-10 rounded-full bg-card/80 border border-border px-4 focus-within:ring-2 focus-within:ring-ring focus-within:border-ring transition">
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
