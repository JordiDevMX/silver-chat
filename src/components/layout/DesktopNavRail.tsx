import { Link } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useTabItems } from "@/constants/tabs";
import { useNavBadges } from "@/hooks/useNotifications";
import type { TabKey } from "@/types/chat";

export interface DesktopNavRailProps {
  active: TabKey;
  onOpenSettings?: () => void;
}

/**
 * Left vertical navigation rail — shown on lg+ breakpoints.
 *
 * Mirrors the icons and semantics of the mobile `MobileTabBar` so the
 * mental model is identical across viewports. The active item is highlighted
 * with the neon gradient pill, exactly like the mobile bar's active state.
 *
 * Navigation is driven by TanStack Router `<Link>` — each item navigates to
 * `/?tab=<key>`, making the rail fully route-agnostic: it works identically
 * whether mounted on the home view or inside the `/chat/$id` route's own
 * shell. Tapping a rail item from inside a conversation correctly routes to
 * the home page with the intended target section.
 *
 * Notification badges are pulled directly from the global router context
 * (via {@link useNavBadges}) so the rail shows the same counters regardless
 * of which route mounts it.
 */
export function DesktopNavRail({ active }: DesktopNavRailProps) {
  const { t } = useTranslation();
  const items = useTabItems();
  const badges = useNavBadges();
  return (
    <aside
      className={cn(
        "hidden lg:flex shrink-0",
        "w-[68px] flex-col items-center gap-2 py-4",
        "border-r border-border/60 bg-gradient-silver",
        "shadow-silver",
      )}
      aria-label={t("nav.primaryNav")}
    >
      {/* Brand mark */}
      <div className="relative h-10 w-10 rounded-xl bg-gradient-neon shadow-glow grid place-items-center mb-2">
        <span className="text-primary-foreground font-bold text-base tracking-tight">S</span>
        <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/30" />
      </div>

      <div className="h-px w-8 bg-border/60 my-1" />

      <ul className="flex flex-col items-center gap-1.5 w-full px-2">
        {items.map(({ key, label, Icon }) => {
          const isActive = active === key;
          const badge = badges[key];
          return (
            <li key={key} className="w-full group">
              <Link
                to="/"
                search={{ tab: key }}
                aria-current={isActive ? "page" : undefined}
                aria-label={label}
                title={label}
                className={cn(
                  "relative w-full h-12 grid place-items-center rounded-xl transition-colors",
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
                      {badge > 99 ? t("nav.badgeOverflow") : badge}
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
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex flex-col items-center gap-1.5 w-full px-2 group relative">
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
          {t("nav.signOut")}
        </span>
      </div>
    </aside>
  );
}