import { MessageCircle, CircleDot, Users, Phone, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TabKey } from "@/types/chat";

export interface DesktopNavRailProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  badges?: Partial<Record<TabKey, number>>;
  onOpenSettings?: () => void;
}

interface RailItem {
  key: TabKey;
  label: string;
  Icon: typeof MessageCircle;
}

const RAIL_ITEMS: RailItem[] = [
  { key: "chats", label: "Chats", Icon: MessageCircle },
  { key: "updates", label: "Updates", Icon: CircleDot },
  { key: "communities", label: "Communities", Icon: Users },
  { key: "calls", label: "Calls", Icon: Phone },
];

/**
 * Left vertical navigation rail — shown on lg+ breakpoints.
 *
 * Mirrors the icons and semantics of the mobile `MobileTabBar` so the
 * mental model is identical across viewports. The active item is highlighted
 * with the neon gradient pill, exactly like the mobile bar's active state.
 */
export function DesktopNavRail({ active, onChange, badges = {}, onOpenSettings }: DesktopNavRailProps) {
  return (
    <aside
      className={cn(
        "hidden lg:flex shrink-0",
        "w-[68px] flex-col items-center gap-2 py-4",
        "border-r border-border/60 bg-gradient-silver",
        "shadow-silver",
      )}
      aria-label="Primary navigation"
    >
      {/* Brand mark */}
      <div className="relative h-10 w-10 rounded-xl bg-gradient-neon shadow-glow grid place-items-center mb-2">
        <span className="text-primary-foreground font-bold text-base tracking-tight">S</span>
        <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/30" />
      </div>

      <div className="h-px w-8 bg-border/60 my-1" />

      <ul className="flex flex-col items-center gap-1.5 w-full px-2">
        {RAIL_ITEMS.map(({ key, label, Icon }) => {
          const isActive = active === key;
          const badge = badges[key] ?? 0;
          return (
            <li key={key} className="w-full">
              <button
                type="button"
                onClick={() => onChange(key)}
                aria-current={isActive ? "page" : undefined}
                aria-label={label}
                title={label}
                className={cn(
                  "group relative w-full h-12 grid place-items-center rounded-xl transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <span
                  className={cn(
                    "relative grid place-items-center h-10 w-10 rounded-xl transition-all",
                    isActive
                      ? "bg-gradient-neon text-primary-foreground shadow-glow"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 2} />
                  {badge > 0 ? (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold leading-none grid place-items-center ring-2 ring-card">
                      {badge > 99 ? "99+" : badge}
                    </span>
                  ) : null}
                </span>
                <span
                  className={cn(
                    "pointer-events-none absolute left-full ml-3 px-2 py-1 rounded-md",
                    "bg-popover text-popover-foreground text-xs font-medium",
                    "border border-border/60 shadow-silver",
                    "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0",
                    "transition-all whitespace-nowrap z-50",
                  )}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex flex-col items-center gap-1.5 w-full px-2">
        {onOpenSettings ? (
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Settings"
            title="Settings"
            className={cn(
              "group relative w-full h-12 grid place-items-center rounded-xl",
              "text-muted-foreground hover:bg-accent/60 hover:text-foreground transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <Settings className="h-5 w-5" />
            <span
              className={cn(
                "pointer-events-none absolute left-full ml-3 px-2 py-1 rounded-md",
                "bg-popover text-popover-foreground text-xs font-medium",
                "border border-border/60 shadow-silver",
                "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0",
                "transition-all whitespace-nowrap z-50",
              )}
            >
              Settings
            </span>
          </button>
        ) : null}

        <button
          type="button"
          aria-label="Sign out"
          title="Sign out"
          className={cn(
            "group relative w-full h-12 grid place-items-center rounded-xl",
            "text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <LogOut className="h-5 w-5" />
          <span
            className={cn(
              "pointer-events-none absolute left-full ml-3 px-2 py-1 rounded-md",
              "bg-popover text-popover-foreground text-xs font-medium",
              "border border-border/60 shadow-silver",
              "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0",
              "transition-all whitespace-nowrap z-50",
            )}
          >
            Sign out
          </span>
        </button>
      </div>
    </aside>
  );
}
