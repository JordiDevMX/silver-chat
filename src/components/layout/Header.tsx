import { Search, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export function Header({ search, onSearchChange, placeholder }: HeaderProps) {
  return (
    <header suppressHydrationWarning className="sticky top-0 z-30 bg-gradient-silver border-b border-border/60 backdrop-blur-xl shadow-silver">
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
          <button
            type="button"
            aria-label="Settings"
            className="h-9 w-9 grid place-items-center rounded-full bg-card/70 border border-border hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="px-4 pb-3">
        <label className="flex items-center gap-2 h-10 rounded-full bg-card/80 border border-border px-4 focus-within:ring-2 focus-within:ring-ring focus-within:border-ring transition">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder ?? "Search conversations…"}
            className="flex-1 bg-transparent outline-hidden text-sm placeholder:text-muted-foreground"
          />
        </label>
      </div>
    </header>
  );
}
