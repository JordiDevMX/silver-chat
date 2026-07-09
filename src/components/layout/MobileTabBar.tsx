import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useTabItems } from "@/constants/tabs";
import { useNavBadges } from "@/hooks/useNotifications";
import type { TabKey } from "@/types/chat";

export interface MobileTabBarProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

/**
 * Bottom tab bar, mounted on mobile AND tablet (anything below Tailwind's
 * `lg` breakpoint, gated by `useIsDesktop()`). The same icon set is
 * mirrored vertically in the `DesktopNavRail` for `lg` and above.
 *
 * Notification badges are pulled directly from the global router context
 * (via {@link useNavBadges}) so the bar shows the same counters regardless
 * of which route mounts it — home list view or `/chat/$id` — fixing the
 * earlier "badges vanish when navigating into a conversation" regression.
 */
export function MobileTabBar({ active, onChange }: MobileTabBarProps) {
  const { t } = useTranslation();
  const tabs = useTabItems();
  const badges = useNavBadges();
  return (
    <nav
      className="lg:hidden sticky bottom-0 z-30 border-t border-border/60 bg-gradient-silver backdrop-blur-xl shadow-silver"
      aria-label={t("nav.primaryNav")}
    >
      <ul className="grid grid-cols-4 px-2 pt-1.5 pb-2">
        {tabs.map(({ key, label, Icon }) => {
          const isActive = active === key;
          const badge = badges[key];
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
                      {badge > 99 ? t("nav.badgeOverflow") : badge}
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