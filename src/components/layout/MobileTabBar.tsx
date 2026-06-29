import { MessageCircle, CircleDot, Users, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TabKey } from "@/types/chat";

export interface MobileTabBarProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  badges?: Partial<Record<TabKey, number>>;
}

const TABS: { key: TabKey; label: string; Icon: typeof MessageCircle }[] = [
  { key: "chats", label: "Chats", Icon: MessageCircle },
  { key: "updates", label: "Updates", Icon: CircleDot },
  { key: "communities", label: "Communities", Icon: Users },
  { key: "calls", label: "Calls", Icon: Phone },
];

/**
 * Bottom tab bar, mounted only on mobile (when `useIsMobile()` is true).
 * The same icon set is mirrored vertically in the `DesktopNavRail` for lg+.
 */
export function MobileTabBar({ active, onChange, badges = {} }: MobileTabBarProps) {
  return (
    <nav
      className="sticky bottom-0 z-30 border-t border-border/60 bg-gradient-silver backdrop-blur-xl shadow-silver"
      aria-label="Primary"
    >
      <ul className="grid grid-cols-4 px-2 pt-1.5 pb-2">
        {TABS.map(({ key, label, Icon }) => {
          const isActive = active === key;
          const badge = badges[key] ?? 0;
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => onChange(key)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group w-full flex flex-col items-center gap-1 py-1.5 rounded-xl transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <span
                  className={cn(
                    "relative grid place-items-center h-9 w-16 rounded-full transition-all",
                    isActive
                      ? "bg-gradient-neon text-primary-foreground shadow-glow"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 2} />
                  {badge > 0 ? (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold leading-none grid place-items-center ring-2 ring-background">
                      {badge > 99 ? "99+" : badge}
                    </span>
                  ) : null}
                </span>
                <span
                  className={cn(
                    "text-[11px] font-medium tracking-tight transition-colors",
                    isActive ? "text-neon" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
